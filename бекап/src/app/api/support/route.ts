import { NextResponse } from 'next/server';
import { getDb, SupportRequest } from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const db = await getDb();
    // Refresh from disk to ensure we have latest support requests
    if ((db as any).readWithRetry) {
        await (db as any).readWithRetry();
    }
    
    let requests = db.data.supportRequests || [];
    const users = db.data.users || [];
    const orders = db.data.orders || [];

    if (status) {
        requests = requests.filter((r: SupportRequest) => r.status === status);
    }

    // Enrich with user and order data
    const enriched = requests.map(req => {
        const user = users.find(u => u.phone === req.userPhone);
        const order = req.orderId ? orders.find(o => o.id === req.orderId) : null;
        
        // Find service cover if order exists
        let serviceCover = null;
        if (order?.serviceId) {
            const services = (db.data as any).services || [];
            const service = services.find((s: any) => s.id === order.serviceId);
            serviceCover = service?.coverImage;
        }
        
        return {
            ...req,
            userEmail: user?.email,
            userAvatar: user?.avatar,
            isPartner: (user as any)?.isPartner,
            orderDetails: order ? {
                orderNumber: order.orderNumber,
                status: order.status,
                clientName: order.clientName,
                partnerName: order.partnerName,
                sellerPhone: order.sellerPhone,
                title: order.title,
                coverImage: serviceCover
            } : null
        };
    });

    return NextResponse.json(enriched);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userPhone: rawPhone, userName, text, type, orderId } = body;

        if (!rawPhone) {
            return NextResponse.json({ error: 'userPhone is required' }, { status: 400 });
        }

        const userPhone = rawPhone === 'guest' ? 'guest' : rawPhone.replace(/\D/g, '');

        const db = await getDb();
        if (!db.data.supportRequests) db.data.supportRequests = [];

        // Check if there is already an open request for this user with SAME type and orderId
        let existing = db.data.supportRequests.find((r: SupportRequest) => {
            const rPhone = r.userPhone === 'guest' ? 'guest' : r.userPhone.replace(/\D/g, '');
            return rPhone === userPhone && r.status === 'open' && r.type === type && r.orderId === orderId;
        });

        if (existing) {
            existing.lastMessage = text || existing.lastMessage;
            existing.createdAt = new Date().toISOString();
        } else {
            const newRequest: SupportRequest = {
                id: `sup_${Date.now()}`,
                userPhone,
                userName: userName || 'Пользователь',
                createdAt: new Date().toISOString(),
                status: 'open',
                lastMessage: text,
                type: type || 'support',
                orderId: orderId
            };
            db.data.supportRequests.push(newRequest);
        }

        await db.write();

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save support request' }, { status: 500 });
    }
}
export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { userPhone: rawPhone, orderId, status } = body;

        if ((!rawPhone && !orderId) || !status) {
            return NextResponse.json({ error: 'userPhone or orderId, and status are required' }, { status: 400 });
        }

        const userPhone = rawPhone ? (rawPhone === 'guest' ? 'guest' : rawPhone.replace(/\D/g, '')) : null;
        const db = await getDb();
        const req = db.data.supportRequests?.find((r: SupportRequest) => {
            if (orderId && r.orderId === orderId && r.status === 'open') return true;
            if (userPhone) {
                const rPhone = r.userPhone === 'guest' ? 'guest' : r.userPhone.replace(/\D/g, '');
                return rPhone === userPhone && r.status === 'open';
            }
            return false;
        });

        if (req) {
            req.status = status;
            
            // If closed, add a closing message and reset AI assistant
            if (status === 'closed') {
                const timestamp = new Date().toISOString();
                
                // 1. System message
                db.data.messages.push({
                    id: `msg_sys_${Date.now()}`,
                    orderId: `support_${req.userPhone}`,
                    senderPhone: 'SYSTEM',
                    text: 'Обращение закрыто оператором.',
                    timestamp: timestamp,
                    isAdminSender: true,
                    isRead: true
                });

                // 2. Standard AI Greeting
                db.data.messages.push({
                    id: `msg_ai_reset_${Date.now()}`,
                    orderId: `support_${req.userPhone}`,
                    senderPhone: 'AI_ASSISTANT',
                    text: "Привет!\nЯ могу помочь тебе выбрать нужный продукт и подскажу как тебе собрать подходящий твоей задаче заказ.\nРасскажи о своем проекте.",
                    timestamp: new Date(Date.now() + 1000).toISOString(),
                    isAdminSender: true,
                    isRead: false,
                    // Note: We'll make sure the frontend handles these buttons from server-side messages too
                    buttons: [
                        "Проблема с заказом",
                        "Проблема с оплатой",
                        "Проблема с приложением",
                        "Как разместить свои услуги?",
                        "Позвать живого человека"
                    ]
                } as any);
            }
            
            await db.write();
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update support request' }, { status: 500 });
    }
}
