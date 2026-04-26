import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [crops] = await db.execute(`
      SELECT 
        crop_id,
        growth_stage,
        fertilizer_type,
        expected_harvest_date,
        estimated_yield,
        planting_date
      FROM crop
      ORDER BY created_at DESC
    `);

    const tasks = [
      { name: 'Basal Application', days: 0 },
      { name: 'First Top Dress', days: 15 },
      { name: 'Second Top Dress', days: 35 },
      { name: 'Harvesting', days: 110 }
    ];

    let result = [];

    for (const crop of crops) {
      const start = new Date(crop.planting_date);

      for (const task of tasks) {
        const date = new Date(start);
        date.setDate(start.getDate() + task.days);

        result.push({
          crop_id: crop.crop_id,
          growth_stage: crop.growth_stage,
          fertilizer_type: crop.fertilizer_type,
          application_schedule: task.name,
          expected_harvest_date: crop.expected_harvest_date,
          estimated_yield: crop.estimated_yield,
          days_remaining: task.days
        });
      }
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error("CROP SCHEDULE ERROR:", error);

    return NextResponse.json(
      {
        error: "Failed to generate schedules from crop table",
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