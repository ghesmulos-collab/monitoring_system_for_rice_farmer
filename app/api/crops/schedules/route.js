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

        c.growth_stage AS crop_growth_stage,
        c.fertilizer_type AS crop_fertilizer_type,
        c.expected_harvest_date AS crop_expected_harvest_date,
        c.estimated_yield AS crop_estimated_yield

      FROM suggested_schedule ss
      LEFT JOIN crop c
        ON LOWER(TRIM(ss.crop_id)) = LOWER(TRIM(c.crop_id))

      ORDER BY ss.crop_id ASC, ss.days_remaining ASC
    `);

    // map clean output so frontend NEVER gets confused
    const formatted = rows.map(r => ({
      suggested_schedule_id: r.suggested_schedule_id,
      crop_id: r.crop_id,
      application_schedule: r.application_schedule ?? 'Unknown Task',
      days_remaining: r.days_remaining,

      growth_stage: r.crop_growth_stage ?? 'N/A',
      fertilizer_type: r.crop_fertilizer_type ?? 'N/A',
      expected_harvest_date: r.crop_expected_harvest_date ?? 'N/A',
      estimated_yield: r.crop_estimated_yield ?? 'N/A'
    }));

    return NextResponse.json(formatted);

  } catch (error) {
    console.error("GET ERROR:", error);

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