import { JSONFilePreset } from 'lowdb/node';

export interface Category {
  id: string;
  name: string;
  iconImage: string;
  coverImage?: string;
  createdAt: string;
  order: number;
}

export interface Feature {
  id: string;
  text: string;
}

export interface Tariff {
  id: string;
  name: string;
  price: string;
  description: string;
  features: Feature[];
}

export interface Design {
  id: string;
  name: string;
  price: string;
  description: string;
}

export interface Service {
  id: string;
  categoryId: string;
  name: string;
  price: string;
  coverImage?: string;
  tariffs: Tariff[];
  designs: Design[];
  createdAt: string;
  sellerPhone: string;
  partnerName?: string;
  partnerAvatar?: string;
}

export interface Order {
  id: string;
  title: string;
  orderNumber: number;
  tariff: string;
  tariffPrice?: number;
  design?: string;
  designPrice?: number;
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
}

export interface ChatMessage {
  id: string;
  orderId: string;
  senderPhone: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  type?: 'text' | 'file';
  fileData?: {
    name: string;
    size: number;
    type: string;
    url: string;
  };
}

export interface SupportRequest {
  id: string;
  userPhone: string;
  status: 'open' | 'closed';
  createdAt: string;
  lastMessage?: string;
}

export interface Data {
  users: any[];
  categories: Category[];
  services: Service[];
  orders: Order[];
  messages: ChatMessage[];
  supportRequests: SupportRequest[];
}

let dbInstance: any = null;

export async function getDb() {
  if (dbInstance) return dbInstance;
  
  const defaultData: Data = { 
    users: [], 
    categories: [], 
    services: [],
    orders: [],
    messages: [],
    supportRequests: []
  };
  
  dbInstance = await JSONFilePreset<Data>('db.json', defaultData);
  return dbInstance;
}
