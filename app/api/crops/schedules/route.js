import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { crop_id, planting_date } = await request.json();
        const start = new Date(planting_date);

        // Define tasks based on your ERD requirements
        const tasks = [
            { name: 'Basal Application', days: 0 },
            { name: 'First Top Dress', days: 15 },
            { name: 'Second Top Dress', days: 35 },
            { name: 'Harvesting', days: 110 }
        ];

        for (const task of tasks) {
            // Use the exact column names from your phpMyAdmin
            await db.execute(
                "INSERT INTO suggested_schedule (application_schedule, days_remaining, crop_id) VALUES (?, ?, ?)",
                [task.name, task.days, crop_id]
            );
        }
        return NextResponse.json({ message: "Schedule Created" });
    } catch (error) {
        console.error("Schedule Error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}