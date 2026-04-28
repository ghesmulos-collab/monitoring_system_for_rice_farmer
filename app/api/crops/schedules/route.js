import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

/* =========================
   GET - Fetch schedules (CLEAN + SAFE)
========================= */
export async function GET() {
  try {
    const [rows] = await db.execute(`
      SELECT 
        ss.suggested_schedule_id,
        ss.crop_id,
        ss.application_schedule,
        ss.application_date,
        ss.days_remaining,

        COALESCE(c.growth_stage, 'N/A') AS growth_stage,
        COALESCE(c.fertilizer_type, 'N/A') AS fertilizer_type,
        COALESCE(c.expected_harvest_date, 'N/A') AS expected_harvest_date,
        COALESCE(c.estimated_yield, 'N/A') AS estimated_yield

      FROM suggested_schedule ss
      LEFT JOIN crop c
        ON LOWER(TRIM(ss.crop_id)) = LOWER(TRIM(c.crop_id))

      ORDER BY ss.crop_id, ss.days_remaining ASC
    `);

    return NextResponse.json(rows || []);

  } catch (error) {
    console.error("GET ERROR:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/* =========================
   POST - Generate schedule (NO DUPLICATES VERSION)
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

    // =========================
    // 1. Get crop
    // =========================
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

    if (!crop.planting_date) {
      return NextResponse.json(
        { success: false, error: "Missing planting_date" },
        { status: 400 }
      );
    }

    // =========================
    // 2. Prevent duplicate full regeneration
    // =========================
    const [existing] = await db.execute(
      `SELECT COUNT(*) as count FROM suggested_schedule WHERE crop_id = ?`,
      [crop_id]
    );

    if (existing[0].count > 0) {
      return NextResponse.json({
        success: true,
        message: "Schedule already exists for this crop"
      });
    }

    // =========================
    // 3. Generate schedule
    // =========================
    const start = new Date(crop.planting_date);

    const tasks = [
      { name: 'Basal Application', days: 0 },
      { name: 'First Top Dress', days: 15 },
      { name: 'Second Top Dress', days: 35 },
      { name: 'Harvesting', days: 110 }
    ];

    for (const task of tasks) {
      const appDate = new Date(start);
      appDate.setDate(appDate.getDate() + task.days);

      const formattedDate = appDate.toISOString().split('T')[0];

      await db.execute(
        `INSERT INTO suggested_schedule
          (application_schedule, application_date, days_remaining, crop_id)
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
          application_schedule = VALUES(application_schedule),
          application_date = VALUES(application_date),
          days_remaining = VALUES(days_remaining)`,
        [
          task.name,
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
        error: "Failed to generate schedule",
        message: error.message
      },
      { status: 500 }
    );
  }
}