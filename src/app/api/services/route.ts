<<<<<<< HEAD
=======

>>>>>>> f0ae42b902bf138f49fc2fb21aade7312fa498cf
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const db = await getDb();
    
    let services = db.data.services || [];
    if (categoryId) {
<<<<<<< HEAD
        services = services.filter((s: any) => s.categoryId === categoryId);
=======
        services = services.filter(s => s.categoryId === categoryId);
>>>>>>> f0ae42b902bf138f49fc2fb21aade7312fa498cf
    }
    
    return NextResponse.json(services);
}

export async function POST(request: Request) {
    const db = await getDb();
    const body = await request.json();
    
    const newService = {
        ...body,
        id: body.id || crypto.randomUUID(),
        createdAt: new Date().toISOString(),
    };

    db.data.services.push(newService);
    await db.write();

    return NextResponse.json(newService);
}

export async function PUT(request: Request) {
    const db = await getDb();
    const body = await request.json();
    const { id, ...updates } = body;

<<<<<<< HEAD
    const index = db.data.services.findIndex((s: any) => s.id === id);
=======
    const index = db.data.services.findIndex(s => s.id === id);
>>>>>>> f0ae42b902bf138f49fc2fb21aade7312fa498cf
    if (index !== -1) {
        db.data.services[index] = { ...db.data.services[index], ...updates };
        await db.write();
        return NextResponse.json(db.data.services[index]);
    }

    return NextResponse.json({ error: 'Service not found' }, { status: 404 });
}

export async function DELETE(request: Request) {
    const db = await getDb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

<<<<<<< HEAD
    db.data.services = db.data.services.filter((s: any) => s.id !== id);
=======
    db.data.services = db.data.services.filter(s => s.id !== id);
>>>>>>> f0ae42b902bf138f49fc2fb21aade7312fa498cf
    await db.write();

    return NextResponse.json({ success: true });
}
