import { NextResponse } from 'next/server';
import { getDb, ChatMessage } from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const checkUnread = searchParams.get('checkUnread');
    const markRead = searchParams.get('markRead');
    const phone = searchParams.get('phone');

    const db = await getDb();

    if (checkUnread === 'true' && phone) {
        // Normalize phone number (digits only, handle guest)
        const cleanPhone = phone === 'guest' ? 'guest' : phone.replace(/\D/g, '');
        
        // Find if user is admin
        const user = db.data.users.find((u: any) => {
            const uPhone = u.phone === 'guest' ? 'guest' : u.phone.replace(/\D/g, '');
            return uPhone === cleanPhone;
        });
        const isAdmin = user?.isAdmin === true || cleanPhone === '79001112233' || cleanPhone === '79999999999';

        // Identify orders that belong to this user (as client or seller)
        let myOrderIds = new Set();
        db.data.orders.forEach((o: any) => {
            const clientP = o.clientPhone === 'guest' ? 'guest' : o.clientPhone?.replace(/\D/g, '');
            const sellerP = o.sellerPhone === 'guest' ? 'guest' : o.sellerPhone?.replace(/\D/g, '');
            
            const isClient = clientP === cleanPhone;
            const isSeller = sellerP === cleanPhone || (isAdmin && o.sellerPhone === 'ADMIN');
            
            if (isClient || isSeller) {
                // For admin, skip orders that are completed or cancelled
                if (isAdmin && (o.status === 'completed' || o.status === 'cancelled')) {
                    // Skip
                } else {
                    myOrderIds.add(o.id);
                }
            }
        });

        const count = db.data.messages.filter((m: any) => {
            const mPhoneRaw = m.senderPhone;
            const mPhoneClean = mPhoneRaw === 'guest' ? 'guest' : mPhoneRaw.replace(/\D/g, '');
            const isFromOthers = mPhoneClean !== cleanPhone;
            const isUnread = m.isRead === false;
            const isForMyOrder = myOrderIds.has(m.orderId);
            
            return isFromOthers && isUnread && isForMyOrder;
        }).length;

        return NextResponse.json({ count });
    }

    if (markRead === 'true' && orderId && phone) {
        const cleanPhone = phone === 'guest' ? 'guest' : phone.replace(/\D/g, '');
        let changed = false;
        db.data.messages.forEach((m: any) => {
            const mSenderRaw = m.senderPhone;
            const mSenderClean = mSenderRaw === 'guest' ? 'guest' : mSenderRaw.replace(/\D/g, '');
            if (m.orderId === orderId && mSenderClean !== cleanPhone && !m.isRead) {
                m.isRead = true;
                changed = true;
            }
        });
        if (changed) await db.write();
        return NextResponse.json({ success: true });
    }

    if (!orderId) {
        return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    }

    // Normalize support orderId: support_+7999... -> support_7999...
    let finalOrderId = orderId;
    if (orderId.startsWith('support_')) {
        const rawPhone = orderId.replace('support_', '');
        const phone = rawPhone === 'guest' ? 'guest' : rawPhone.replace(/\D/g, '');
        finalOrderId = `support_${phone}`;
    }

    const messages = db.data.messages.filter((m: any) => m.orderId === finalOrderId);

    return NextResponse.json(messages);
}

export async function POST(request: Request) {
    try {
        const message: ChatMessage = await request.json();
        const db = await getDb();

        // Normalize support orderId in message
        if (message.orderId && message.orderId.startsWith('support_')) {
            const rawPhone = message.orderId.replace('support_', '');
            const phone = rawPhone === 'guest' ? 'guest' : rawPhone.replace(/\D/g, '');
            message.orderId = `support_${phone}`;
        }

        const newMessage = { ...message, isRead: false };
        
        // Prevent duplicates by ID
        const exists = db.data.messages.some((m: any) => m.id === newMessage.id);
        if (!exists) {
            db.data.messages.push(newMessage);

            // Update Support Request last message and timestamp
            if (newMessage.orderId && newMessage.orderId.startsWith('support_')) {
                const rawPhone = newMessage.orderId.replace('support_', '');
                const userPhone = rawPhone === 'guest' ? 'guest' : rawPhone.replace(/\D/g, '');
                const supportReq = db.data.supportRequests?.find((r: any) => {
                    const rPhone = r.userPhone === 'guest' ? 'guest' : r.userPhone.replace(/\D/g, '');
                    return rPhone === userPhone && r.status === 'open';
                });
                if (supportReq) {
                    supportReq.lastMessage = newMessage.text;
                    supportReq.createdAt = newMessage.timestamp || new Date().toISOString();
                }
            }

            await db.write();
        }

        return NextResponse.json({ success: true, message: newMessage });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
    }
}
