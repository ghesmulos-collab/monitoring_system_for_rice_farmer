import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

/* =========================
   GET - Fetch schedules (FIXED)
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
        COALESCE(c.fertilizer_type, 'N/A') AS fertilizer_type
      FROM suggested_schedule s
      LEFT JOIN crop c ON s.crop_id = c.crop_id
      ORDER BY s.suggested_schedule_id DESC
    `);

    // 🔥 FORCE SAFE OUTPUT (prevents blank UI)
    const formatted = (rows || []).map(row => ({
      schedule_id: row.suggested_schedule_id,
      crop_id: row.crop_id ?? "N/A",
      application_schedule: row.application_schedule ?? "N/A",
      application_date: row.application_date ?? "N/A",
      days_remaining: row.days_remaining ?? 0,
      fertilizer_type: row.fertilizer_type ?? "N/A"
    }));

    return NextResponse.json(formatted);

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