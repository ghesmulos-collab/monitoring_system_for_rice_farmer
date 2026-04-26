import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

/* =========================
   GET - Fetch schedules (SAFE)
========================= */
export async function GET() {
    try {
        const [rows] = await db.execute(`
            SELECT 
                schedule_id,
                crop_id,
                application_schedule,
                fertilizer_type,
                application_date,
                days_remaining
            FROM suggested_schedule
            ORDER BY schedule_id DESC
        `);

        // ALWAYS return array
        const formatted = (rows || []).map((row) => ({
            schedule_id: row.schedule_id,
            crop_id: row.crop_id || "N/A",
            application_schedule: row.application_schedule || "N/A",
            fertilizer_type: row.fertilizer_type || "N/A",
            application_date: row.application_date || "N/A",
            days_remaining: row.days_remaining ?? 0
        }));

        return NextResponse.json(formatted);

    } catch (error) {
        console.error("GET Schedule Error:", error.message);

        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

/* =========================
   POST - Generate schedule (FIXED AT SOURCE 🔥)
========================= */
export async function POST(request) {
    try {
        const body = await request.json();
        const { crop_id } = body;

        if (!crop_id) {
            return NextResponse.json(
                { error: "crop_id is required" },
                { status: 400 }
            );
        }

        const [cropRows] = await db.execute(
            `SELECT planting_date, fertilizer_type 
             FROM crop 
             WHERE crop_id = ?`,
            [crop_id]
        );

        if (!cropRows || cropRows.length === 0) {
            return NextResponse.json(
                { error: "Crop not found" },
                { status: 404 }
            );
        }

        const planting_date = cropRows[0].planting_date;
        const baseFertilizer = cropRows[0].fertilizer_type || "Urea";

        const start = new Date(planting_date);

        const tasks = [
            { name: 'Basal Application', days: 0, fertilizer: baseFertilizer },
            { name: 'First Top Dress', days: 15, fertilizer: 'Urea' },
            { name: 'Second Top Dress', days: 35, fertilizer: 'Ammonium Sulfate' },
            { name: 'Harvesting', days: 110, fertilizer: 'Potassium' }
        ];

        for (const task of tasks) {

            // 🔥 FIX: GUARANTEE VALID STRING
            const application_schedule = task.name || "Unknown Schedule";
            const fertilizer = task.fertilizer || "Urea";

            const appDate = new Date(start);
            appDate.setDate(start.getDate() + task.days);

            const formattedDate = appDate.toISOString().split('T')[0];

            await db.execute(
                `INSERT INTO suggested_schedule
                 (application_schedule, fertilizer_type, application_date, days_remaining, crop_id)
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    application_schedule,
                    fertilizer,
                    formattedDate,
                    task.days ?? 0,
                    crop_id
                ]
            );
        }

        return NextResponse.json({
            message: "Schedule Created Successfully"
        });

    } catch (error) {
        console.error("POST Schedule Error:", error.message);

        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}