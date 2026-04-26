import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { crop_id, fertilizer_type, application_date } = await request.json();

        const message = `Apply ${fertilizer_type} on ${application_date} for Crop ${crop_id}.`;

        await db.execute(
            `INSERT INTO fertilizer_notification 
            (recommended_fertilizer, application_date, notification_message, crop_id) 
            VALUES (?, ?, ?, ?)`,
            [fertilizer_type, application_date, message, crop_id]
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Notification Error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}