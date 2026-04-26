import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

/* =========================
   GET - Debug / Safe Fetch
========================= */
export async function GET() {
  try {
    const [[dbName]] = await db.execute(`SELECT DATABASE() AS db`);

    const [cropCheck] = await db.execute(`
      SELECT * FROM crop
    `);

    const [scheduleCheck] = await db.execute(`
      SELECT * FROM suggested_schedule
    `);

    return NextResponse.json({
      success: true,
      database: dbName.db,
      crop_sample: cropCheck,
      schedule_sample: scheduleCheck
    });

  } catch (error) {
    console.error("GET ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch debug data",
        message: error.message
      },
      { status: 500 }
    );
  }
}

/* =========================
   POST - Generate schedule (ROBUST FIXED)
========================= */
export async function POST(request) {
  try {
    const { crop_id } = await request.json();

    if (!crop_id) {
      return NextResponse.json(
        { success: false, error: "crop_id is required" },
        { status: 400 }
      );
    }

    // Get crop
    const [cropRows] = await db.execute(
      `SELECT * FROM crop WHERE LOWER(TRIM(crop_id)) = LOWER(TRIM(?))`,
      [crop_id]
    );

    if (!cropRows || cropRows.length === 0) {
      return NextResponse.json(
        { success: false, error: "Crop not found" },
        { status: 404 }
      );
    }

    const crop = cropRows[0];

    // Validate required fields
    if (!crop.planting_date) {
      return NextResponse.json(
        { success: false, error: "Missing planting_date in crop table" },
        { status: 400 }
      );
    }

    const start = new Date(crop.planting_date);

    const tasks = [
      { name: 'Basal Application', days: 0 },
      { name: 'First Top Dress', days: 15 },
      { name: 'Second Top Dress', days: 35 },
      { name: 'Harvesting', days: 110 }
    ];

    // OPTIONAL: prevent duplicate schedules
    await db.execute(
      `DELETE FROM suggested_schedule WHERE crop_id = ?`,
      [crop_id]
    );

    // Insert schedule
    for (const task of tasks) {
      const appDate = new Date(start);
      appDate.setDate(appDate.getDate() + task.days);

      const formattedDate = appDate.toISOString().split('T')[0];

      await db.execute(
        `INSERT INTO suggested_schedule
        (application_schedule, application_date, days_remaining, crop_id)
        VALUES (?, ?, ?, ?)`,
        [
          task.name || "Unknown Task",
          formattedDate,
          task.days,
          crop_id
        ]
      );
    }

    return NextResponse.json({
      success: true,
      message: "Schedule generated successfully"
    });

  } catch (error) {
    console.error("POST ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create schedule",
        message: error.message
      },
      { status: 500 }
    );
  }
}