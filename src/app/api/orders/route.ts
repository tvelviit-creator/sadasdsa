
import { NextResponse } from 'next/server';
import { getDb, Order } from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const clientPhone = searchParams.get('clientPhone');
    const sellerPhone = searchParams.get('sellerPhone');
    const id = searchParams.get('id');

    const db = await getDb();

    if (id) {
        const order = db.data.orders.find((o) => o.id === id);
        return NextResponse.json(order || null);
    }

    if (clientPhone) {
        // Basic normalization
        const normalized = clientPhone.replace(/^\+/, "").replace(/\s/g, "");
        const orders = db.data.orders.filter(o =>
            o.clientPhone.replace(/^\+/, "").replace(/\s/g, "") === normalized
        );
        return NextResponse.json(orders);
    }

    if (sellerPhone) {
        // Basic normalization
        const normalized = sellerPhone.replace(/^\+/, "").replace(/\s/g, "");
        const orders = db.data.orders.filter(o =>
            o.sellerPhone.replace(/^\+/, "").replace(/\s/g, "") === normalized
        );
        return NextResponse.json(orders);
    }

    return NextResponse.json(db.data.orders);
}

export async function POST(request: Request) {
    const body = await request.json();
    const db = await getDb();

    // Upsert logic
    const existingOrderIndex = db.data.orders.findIndex((o) => o.id === body.id);
    if (existingOrderIndex >= 0) {
        db.data.orders[existingOrderIndex] = { ...db.data.orders[existingOrderIndex], ...body };
    } else {
        db.data.orders.push(body as Order);
    }

    await db.write();
    return NextResponse.json({ success: true, order: body });
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const db = await getDb();
    const existingOrderIndex = db.data.orders.findIndex((o) => o.id === id);

    if (existingOrderIndex >= 0) {
        db.data.orders.splice(existingOrderIndex, 1);
        await db.write();
        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
}
