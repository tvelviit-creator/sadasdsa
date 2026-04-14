<<<<<<< HEAD
=======

>>>>>>> f0ae42b902bf138f49fc2fb21aade7312fa498cf
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
<<<<<<< HEAD
        order: body.order ?? (db.data.categories.length > 0 ? Math.max(...db.data.categories.map((c: any) => c.order || 0)) + 1 : 0),
=======
>>>>>>> f0ae42b902bf138f49fc2fb21aade7312fa498cf
    };

    db.data.categories.push(newCategory);
    await db.write();

    return NextResponse.json(newCategory);
}

export async function PUT(request: Request) {
    const db = await getDb();
    const body = await request.json();
    const { id, ...updates } = body;

<<<<<<< HEAD
    const index = db.data.categories.findIndex((c: any) => c.id === id);
=======
    const index = db.data.categories.findIndex(c => c.id === id);
>>>>>>> f0ae42b902bf138f49fc2fb21aade7312fa498cf
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

<<<<<<< HEAD
    db.data.categories = db.data.categories.filter((c: any) => c.id !== id);
=======
    db.data.categories = db.data.categories.filter(c => c.id !== id);
>>>>>>> f0ae42b902bf138f49fc2fb21aade7312fa498cf
    await db.write();

    return NextResponse.json({ success: true });
}
<<<<<<< HEAD
export async function PATCH(request: Request) {
    const db = await getDb();
    const body = await request.json(); // Expecting { ids: string[] }
    const { ids } = body;

    if (!Array.isArray(ids)) {
        return NextResponse.json({ error: 'IDs array required' }, { status: 400 });
    }

    ids.forEach((id, index) => {
        const cat = db.data.categories.find((c: any) => c.id === id);
        if (cat) {
            cat.order = index;
        }
    });

    await db.write();
    return NextResponse.json({ success: true });
}
=======
>>>>>>> f0ae42b902bf138f49fc2fb21aade7312fa498cf
