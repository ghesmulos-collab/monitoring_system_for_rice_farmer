import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

/* =========================
   GET - Fetch Notifications (for table display)
========================= */
export async function GET() {
    try {
        const [rows] = await db.execute(`
            SELECT 
                fertilizer_notification_id AS notification_id,
                crop_id,
                recommended_fertilizer,
                notification_message
            FROM fertilizer_notification
            ORDER BY fertilizer_notification_id DESC
        `);

        return NextResponse.json(rows);

    } catch (error) {
        console.error("GET Notification Error:", error.message);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

/* =========================
   POST - Create Notification
========================= */
export async function POST(request) {
    try {
        const { crop_id } = await request.json();

        const [cropRows] = await db.execute(
            `SELECT fertilizer_type 
             FROM crop 
             WHERE crop_id = ?`,
            [crop_id]
        );

        if (cropRows.length === 0) {
            return NextResponse.json(
                { error: "Crop not found" },
                { status: 404 }
            );
        }

        // FIX: safe fallback
        const fertilizer_type = cropRows[0].fertilizer_type || "Urea";

        const message = `Plan created for Crop ${crop_id}. Schedule basal fertilizer: ${fertilizer_type}.`;

        await db.execute(
            `INSERT INTO fertilizer_notification 
            (recommended_fertilizer, notification_message, crop_id)
            VALUES (?, ?, ?)`,
            [
                fertilizer_type,
                message,
                crop_id
            ]
        );

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("POST Notification Error:", error.message);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}