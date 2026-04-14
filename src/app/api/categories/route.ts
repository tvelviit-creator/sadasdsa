
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
    const db = await getDb();
    return NextResponse.json(db.data.categories || []);
}

export async function POST(request: Request) {
    const db = await getDb();
    const body = await request.json();
    
    const newCategory = {
        id: body.id || crypto.randomUUID(),
        name: body.name,
        iconImage: body.iconImage,
        coverImage: body.coverImage,
        createdAt: new Date().toISOString(),
    };

    db.data.categories.push(newCategory);
    await db.write();

    return NextResponse.json(newCategory);
}

export async function PUT(request: Request) {
    const db = await getDb();
    const body = await request.json();
    const { id, ...updates } = body;

    const index = db.data.categories.findIndex(c => c.id === id);
    if (index !== -1) {
        db.data.categories[index] = { ...db.data.categories[index], ...updates };
        await db.write();
        return NextResponse.json(db.data.categories[index]);
    }

    return NextResponse.json({ error: 'Category not found' }, { status: 404 });
}

export async function DELETE(request: Request) {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    db.data.categories = db.data.categories.filter(c => c.id !== id);
    await db.write();

    return NextResponse.json({ success: true });
}
