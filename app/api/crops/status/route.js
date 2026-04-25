import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { crop_id, status_name } = await request.json();

        // The query uses the exact column names from your ERD: 
        // Crop_Status (the stage) and Crop_ID (the link)
        const [result] = await db.execute(
            "INSERT INTO crop_status (Crop_Status, Crop_ID) VALUES (?, ?)",
            [status_name, crop_id]
        );

        return NextResponse.json({ success: true, id: result.insertId });
    } catch (error) {
        console.error("ERD Sync Error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}