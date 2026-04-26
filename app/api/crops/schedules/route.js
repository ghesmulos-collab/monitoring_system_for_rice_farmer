import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

/* =========================
   GET - Fetch Suggested Schedules (FIXED)
========================= */
export async function GET() {
    try {
        const [rows] = await db.execute(`
            SELECT 
                schedule_id AS id,
                crop_id,
                growth_stage,
                application_schedule,

                -- FIX: prevent N/A from NULL values
                COALESCE(fertilizer_type, 'Urea') AS fertilizer_type,

                -- FIX: safe date fallback
                COALESCE(application_date, 'N/A') AS application_date,

                COALESCE(estimated_yield, 0) AS estimated_yield,

                COALESCE(days_remaining, 0) AS days_remaining

            FROM suggested_schedule
        `);

        return NextResponse.json(rows);

    } catch (error) {
        console.error("GET Schedule Error:", error.message);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

/* =========================
   POST - Generate Suggested Schedule (FIXED)
========================= */
export async function POST(request) {
    try {
        const { crop_id } = await request.json();

        const [cropRows] = await db.execute(
            `SELECT planting_date, fertilizer_type 
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

        const planting_date = cropRows[0].planting_date;

        // FIX: ensure fertilizer never becomes NULL
        const baseFertilizer = cropRows[0].fertilizer_type || 'Urea';

        const start = new Date(planting_date);

        const tasks = [
            { name: 'Basal Application', days: 0, fertilizer: baseFertilizer },
            { name: 'First Top Dress', days: 15, fertilizer: 'Urea' },
            { name: 'Second Top Dress', days: 35, fertilizer: 'Ammonium Sulfate' },
            { name: 'Harvesting', days: 110, fertilizer: baseFertilizer }
        ];

        for (const task of tasks) {
            const appDate = new Date(start);
            appDate.setDate(start.getDate() + task.days);

            const formattedDate = appDate.toISOString().split('T')[0];

            await db.execute(
                `INSERT INTO suggested_schedule
                (
                    crop_id,
                    growth_stage,
                    application_schedule,
                    fertilizer_type,
                    application_date,
                    estimated_yield,
                    days_remaining
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    crop_id,
                    task.name,
                    'Every 2-3 weeks',
                    task.fertilizer,
                    formattedDate,
                    0,               
                    task.days
                ]
            );
        }

        return NextResponse.json({ message: "Schedule Created Successfully" });

    } catch (error) {
        console.error("POST Schedule Error:", error.message);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}