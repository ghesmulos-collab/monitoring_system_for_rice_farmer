import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [dbName] = await db.execute(`SELECT DATABASE() AS db`);

    const [cropCheck] = await db.execute(`SELECT * FROM crop`);

    const [scheduleCheck] = await db.execute(`SELECT * FROM suggested_schedule`);

    return NextResponse.json({
      database: dbName[0].db,
      crop_sample: cropCheck,
      schedule_sample: scheduleCheck
    });

  } catch (error) {
    return NextResponse.json({
      error: error.message
    });
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

    // Get crop data
    const [cropRows] = await db.execute(
      `SELECT * FROM crop WHERE crop_id = ?`,
      [crop_id]
    );

    if (!cropRows || cropRows.length === 0) {
      return NextResponse.json(
        { error: "Crop not found" },
        { status: 404 }
      );
    }

    const crop = cropRows[0];

    const start = new Date(crop.planting_date);

    const tasks = [
      { name: 'Basal Application', days: 0 },
      { name: 'First Top Dress', days: 15 },
      { name: 'Second Top Dress', days: 35 },
      { name: 'Harvesting', days: 110 }
    ];

    // Generate schedule rows
    for (const task of tasks) {
      const appDate = new Date(start);
      appDate.setDate(appDate.getDate() + task.days);

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
      {
        error: "Failed to create schedule",
        debug: error.message
      },
      { status: 500 }
    );
  }
}