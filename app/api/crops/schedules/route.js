import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { crop_id, planting_date } = await request.json();
        const start = new Date(planting_date);

        const tasks = [
            { name: 'Basal Application', days: 0, fertilizer: 'Complete Fertilizer (14-14-14)' },
            { name: 'First Top Dress', days: 15, fertilizer: 'Urea' },
            { name: 'Second Top Dress', days: 35, fertilizer: 'Ammonium Sulfate' },
            { name: 'Harvesting', days: 110, fertilizer: 'N/A' }
        ];

        for (const task of tasks) {
            const appDate = new Date(start);
            appDate.setDate(start.getDate() + task.days);

            const formattedDate = appDate.toISOString().split('T')[0];

            await db.execute(
                `INSERT INTO suggested_schedule 
                (application_schedule, fertilizer_type, application_date, days_remaining, crop_id) 
                VALUES (?, ?, ?, ?, ?)`,
                [task.name, task.fertilizer, formattedDate, task.days, crop_id]
            );
        }

        return NextResponse.json({ message: "Schedule Created" });
    } catch (error) {
        console.error("Schedule Error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}