import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [rows] = await db.execute(`
      SELECT 
        s.suggested_schedule_id,
        s.crop_id,
        s.application_schedule,
        s.days_remaining,

        c.growth_stage,
        c.fertilizer_type,
        c.expected_harvest_date,
        c.estimated_yield

      FROM suggested_schedule s
      INNER JOIN crop c ON s.crop_id = c.crop_id
      ORDER BY s.crop_id, s.days_remaining DESC
    `);

    const formatted = (rows || []).map(r => ({
      schedule_id: r.suggested_schedule_id,
      crop_id: r.crop_id,

      growth_stage: r.growth_stage,
      fertilizer_type: r.fertilizer_type,
      application_schedule: r.application_schedule,

      expected_harvest_date: r.expected_harvest_date,
      estimated_yield: r.estimated_yield,

      days_remaining: r.days_remaining
    }));

    return NextResponse.json(formatted);

  } catch (error) {
    console.error("SCHEDULE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch schedules", debug: error.message },
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