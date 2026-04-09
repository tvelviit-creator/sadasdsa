
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import fs from 'fs';

// Data types - same as before
export type Order = {
    id: string;
    title: string;
    orderNumber: number;
    tariff: string;
    price: number;
    status: "pending" | "in_progress" | "completed" | "cancelled";
    createdAt: string;
    updatedAt?: string;
    clientPhone: string;
    clientEmail?: string;
    sellerPhone: string;
    description?: string;
    stage?: "processing" | "design" | "development" | "test" | "ready";
    features?: string[];
    partnerName?: string;
    clientName?: string;
    isDisputed?: boolean;
    disputeResolved?: boolean;
    serviceId?: string;
};

export type UserData = {
    phone: string;
    name?: string;
    email?: string;
    avatar?: string;
    isPartner?: boolean;
    isAdmin?: boolean;
    balance?: number;
};

export type ChatMessage = {
    id: string;
    orderId: string;
    senderPhone: string;
    text: string;
    timestamp: string;
    isRead?: boolean;
    isAdminSender?: boolean;
    isSystem?: boolean;
};

export type SupportRequest = {
    id: string;
    userPhone: string;
    userName?: string;
    createdAt: string;
    status: 'open' | 'closed';
    lastMessage?: string;
    type?: 'support' | 'dispute';
    orderId?: string;
};

type Data = {
    orders: Order[];
    users: UserData[];
    messages: ChatMessage[];
    supportRequests: SupportRequest[];
};

const defaultData: Data = { orders: [], users: [], messages: [], supportRequests: [] };

// Singleton references on globalThis to survive HMR
const globalForDb = globalThis as unknown as {
    dbInstance: Low<Data> | null;
    initPromise: Promise<Low<Data>> | null;
    writeQueue: Promise<void>;
};

if (!globalForDb.writeQueue) {
    globalForDb.writeQueue = Promise.resolve();
}

/**
 * Robust database accessor with singleton persistence, 
 * retry logic for file reading, and a mandatory write queue.
 */
export const getDb = async (): Promise<Low<Data>> => {
    if (globalForDb.dbInstance) {
        // Even if we have a singleton, we might want to refresh from disk if needed.
        // But for high-frequency polling, we mostly rely on the memory state 
        // since all writes in THIS process update THIS instance.
        return globalForDb.dbInstance;
    }

    if (globalForDb.initPromise) {
        return globalForDb.initPromise;
    }

    globalForDb.initPromise = (async () => {
        try {
            const dbFile = 'db.json';
            const adapter = new JSONFile<Data>(dbFile);
            const db = new Low<Data>(adapter, defaultData);
            
            const readWithRetry = async (instance: Low<Data>, attempts = 5) => {
                for (let i = 0; i < attempts; i++) {
                    try {
                        const exists = fs.existsSync(dbFile);
                        if (!exists) {
                            instance.data = { ...defaultData };
                            await instance.write();
                            return true;
                        }
                        
                        await instance.read();
                        const d = instance.data;
                        if (d && Array.isArray(d.supportRequests) && Array.isArray(d.messages)) {
                            return true;
                        }
                        console.warn(`⚠️ [DB] Read attempt ${i+1} incomplete. Retrying...`);
                    } catch (e) {
                        console.warn(`⚠️ [DB] Read attempt ${i+1} locked/failed. Retrying...`);
                    }
                    await new Promise(r => setTimeout(r, 150));
                }
                return false;
            };

            const success = await readWithRetry(db);
            if (!success) {
                console.error("❌ [DB] Failed to initialize after retries. Using fallback.");
                db.data = { ...defaultData };
            }

            // Patch db.write with serialized queue
            const originalWrite = db.write.bind(db);
            db.write = async () => {
                const writeOp = globalForDb.writeQueue.then(async () => {
                    try {
                        if (db.data && Array.isArray(db.data.supportRequests)) {
                            await originalWrite();
                        }
                    } catch (e) {
                        console.error("❌ [DB] Write failed:", e);
                    }
                });
                globalForDb.writeQueue = writeOp;
                return writeOp;
            };

            // Patch db.read as well to use the same logic if called manually
            const originalRead = db.read.bind(db);
            (db as any).readWithRetry = () => readWithRetry(db);

            globalForDb.dbInstance = db;
            return db;
        } catch (error) {
            console.error("❌ [DB] Singleton init error:", error);
            const fallback = new Low<Data>({ read: async() => {}, write: async() => {} } as any, defaultData);
            fallback.data = { ...defaultData };
            return fallback;
        } finally {
            globalForDb.initPromise = null;
        }
    })();

    return globalForDb.initPromise;
};
