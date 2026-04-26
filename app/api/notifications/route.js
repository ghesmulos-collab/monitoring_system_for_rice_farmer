import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

/* =========================
   GET - Fetch notifications (FIXED)
========================= */
export async function GET() {
    try {
        const [rows] = await db.execute(`
            SELECT 
                notification_id AS id,
                crop_id,
                recommended_fertilizer AS fertilizer_type,
                COALESCE(application_date, 'N/A') AS application_date,
                notification_message
            FROM fertilizer_notification
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
   POST - Create notification (FIXED SAFETY)
========================= */
export async function POST(request) {
    try {
        const { crop_id } = await request.json();

        const [cropRows] = await db.execute(
            `SELECT fertilizer_type, application_date 
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

        // 🔥 SAFETY FIX: prevent NULL values
        const fertilizer_type = cropRows[0].fertilizer_type || "Urea";
        const application_date = cropRows[0].application_date || "N/A";

        const message = `Apply ${fertilizer_type} on ${application_date} for Crop ID ${crop_id}.`;

        await db.execute(
            `INSERT INTO fertilizer_notification 
            (recommended_fertilizer, application_date, notification_message, crop_id)
            VALUES (?, ?, ?, ?)`,
            [
                fertilizer_type,
                application_date,
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