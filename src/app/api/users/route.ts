
import { NextResponse } from 'next/server';
import { getDb, UserData } from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');

    const db = await getDb();

    if (phone) {
        const normalized = phone.replace(/^\+/, "").replace(/\s/g, "");
        const user = db.data.users.find(u => 
            u.phone.replace(/^\+/, "").replace(/\s/g, "") === normalized
        );
        return NextResponse.json(user || null);
    }

    return NextResponse.json(db.data.users || []);
}

export async function POST(request: Request) {
    const body = await request.json();
    const db = await getDb();

    if (!body.phone) {
        return NextResponse.json({ error: 'Phone is required' }, { status: 400 });
    }

    const normalized = body.phone.replace(/^\+/, "").replace(/\s/g, "");
    
    if (!db.data.users) db.data.users = [];
    
    const existingIndex = db.data.users.findIndex(u => 
        u.phone.replace(/^\+/, "").replace(/\s/g, "") === normalized
    );

    if (existingIndex >= 0) {
        db.data.users[existingIndex] = { ...db.data.users[existingIndex], ...body };
    } else {
        db.data.users.push(body as UserData);
    }

    await db.write();
    return NextResponse.json({ success: true, user: body });
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');

    if (!phone) {
        return NextResponse.json({ error: 'Missing phone' }, { status: 400 });
    }

    const db = await getDb();
    const normalized = phone.replace(/^\+/, "").replace(/\s/g, "");
    
    const existingIndex = db.data.users.findIndex(u => 
        u.phone.replace(/^\+/, "").replace(/\s/g, "") === normalized
    );

    if (existingIndex >= 0) {
        db.data.users.splice(existingIndex, 1);
        await db.write();
        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'User not found' }, { status: 404 });
}
