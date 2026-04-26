import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

/* =========================
   GET - Fetch Notifications (FIXED with JOIN)
========================= */
export async function GET() {
    try {
        const [rows] = await db.execute(`
            SELECT 
                fn.fertilizer_notification_id AS notification_id,
                fn.crop_id,
                fn.recommended_fertilizer,
                fn.notification_message,

                -- 🔥 GET REAL DATE FROM CROP TABLE
                c.application_date

            FROM fertilizer_notification fn
            LEFT JOIN crop c 
            ON fn.crop_id = c.crop_id

            ORDER BY fn.fertilizer_notification_id DESC
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

        const fertilizer_type = cropRows[0].fertilizer_type || "Urea";
        const application_date = cropRows[0].application_date;

        const message = `Apply ${fertilizer_type} on ${application_date} for Crop ID ${crop_id}.`;

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