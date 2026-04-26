import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [rows] = await db.execute(`
      SELECT 
        ss.suggested_schedule_id,
        ss.crop_id,
        ss.application_schedule,
        ss.days_remaining,

        c.growth_stage,
        c.expected_harvest_date,
        c.estimated_yield

      FROM suggested_schedule ss
      INNER JOIN crop c
        ON LOWER(ss.crop_id) = LOWER(c.crop_id)

      ORDER BY ss.crop_id ASC, ss.days_remaining ASC
    `);

    return NextResponse.json(rows);

  } catch (error) {
    console.error("GET Schedule Error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch schedules",
        debug: error.message
      },
      { status: 500 }
    );
  }
}
/* =========================
   POST - Generate schedule (FIXED)
========================= */
export async function POST(request) {
  try {
    const { crop_id } = await request.json();

    if (!crop_id) {
      return NextResponse.json(
        { error: "crop_id is required" },
        { status: 400 }
      );
    }

    const [cropRows] = await db.execute(
      `SELECT planting_date, fertilizer_type FROM crop WHERE crop_id = ?`,
      [crop_id]
    );

    if (!cropRows || cropRows.length === 0) {
      return NextResponse.json(
        { error: "Crop not found" },
        { status: 404 }
      );
    }

    const start = new Date(cropRows[0].planting_date);
    const fertilizerType = cropRows[0].fertilizer_type || "Urea";

    const tasks = [
      { name: 'Basal Application', days: 0 },
      { name: 'First Top Dress', days: 15 },
      { name: 'Second Top Dress', days: 35 },
      { name: 'Harvesting', days: 110 }
    ];

    for (const task of tasks) {
      const appDate = new Date(start);
      appDate.setDate(start.getDate() + task.days);

      const formattedDate = appDate.toISOString().split('T')[0];

      await db.execute(
        `INSERT INTO suggested_schedule
         (application_schedule, application_date, days_remaining, crop_id)
         VALUES (?, ?, ?, ?)`,
        [
          task.name,
          formattedDate,
          task.days,
          crop_id
        ]
      );
    }

    return NextResponse.json({
      message: "Schedule created successfully"
    });

  } catch (error) {
    console.error("POST Schedule Error:", error);

    return NextResponse.json(
      { error: "Failed to create schedule" },
      { status: 500 }
    );
  }
}