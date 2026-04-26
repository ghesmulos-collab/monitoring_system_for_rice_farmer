import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

/* =========================
   GET - Fetch schedules (FIXED PROPER JOIN)
========================= */
export async function GET() {
  try {
    const [rows] = await db.execute(`
      SELECT 
        s.suggested_schedule_id,
        s.crop_id,
        s.application_schedule,
        s.application_date,
        s.days_remaining,
        c.fertilizer_type
      FROM suggested_schedule s
      LEFT JOIN crop c ON s.crop_id = c.crop_id
      ORDER BY s.suggested_schedule_id DESC
    `);

    return NextResponse.json(rows || []);

  } catch (error) {
    console.error("SCHEDULE GET ERROR:", error);

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
   POST - Generate schedule
========================= */
export async function POST(request) {
  try {
    const body = await request.json();
    const crop_id = body.crop_id;

    if (!crop_id) {
      return NextResponse.json(
        { error: "crop_id is required" },
        { status: 400 }
      );
    }

    const [cropRows] = await db.execute(
      `SELECT planting_date FROM crop WHERE crop_id = ?`,
      [crop_id]
    );

    if (!cropRows || cropRows.length === 0) {
      return NextResponse.json(
        { error: "Crop not found" },
        { status: 404 }
      );
    }

    const planting_date = cropRows[0].planting_date;
    const start = new Date(planting_date);

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