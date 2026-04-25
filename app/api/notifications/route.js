import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { crop_id, fertilizer_type } = await request.json();

        const message = `Plan created for Crop ${crop_id}. Schedule basal fertilizer.`;

        // Match columns: fertilizer_notification_id (AI), recommended_fertilizer, notification_message, crop_id
        await db.execute(
            "INSERT INTO fertilizer_notification (recommended_fertilizer, notification_message, crop_id) VALUES (?, ?, ?)",
            [fertilizer_type, message, crop_id]
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}