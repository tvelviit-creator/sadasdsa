import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const db = await getDb();
        
        // Reset all data
        db.data = {
            orders: [],
            users: [],
            messages: [],
            supportRequests: []
        };
        
        await db.write();
        
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to reset database:', error);
        return NextResponse.json({ error: 'Failed to reset database' }, { status: 500 });
    }
}
