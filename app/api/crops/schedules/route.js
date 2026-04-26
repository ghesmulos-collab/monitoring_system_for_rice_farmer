import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

/* =========================
   GET - Fetch schedules
========================= */
export async function GET() {
  try {
    const [rows] = await db.execute(`
      SELECT 
        suggested_schedule_id AS schedule_id,
        crop_id,
        application_schedule,
        fertilizer_type,
        application_date,
        days_remaining
      FROM suggested_schedule
      ORDER BY suggested_schedule_id DESC
    `);

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
    console.error("GET Schedule Error:", error);

    return NextResponse.json(
      { error: "Failed to fetch schedules" },
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
      const appDate = new Date(start);
      appDate.setDate(start.getDate() + task.days);

      const formattedDate = appDate.toISOString().split('T')[0];

      await db.execute(
        `INSERT INTO suggested_schedule
         (application_schedule, fertilizer_type, application_date, days_remaining, crop_id)
         VALUES (?, ?, ?, ?, ?)`,
        [
          task.name,             // ✅ NO MORE NULL
          task.fertilizer,
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