import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(request) {
  try {
    const { cropId, actualYield } = await request.json();

    // Changed check: actualYield can be 0, so we check if it is undefined
    if (!cropId || actualYield === undefined) {
      return NextResponse.json({ error: "Missing Crop ID or Yield" }, { status: 400 });
    }

    // FIX: Instead of UPDATE crop, we use an UPSERT on the dedicated yield table.
    // This handles both the first time you add a yield and any future updates.
    const query = `
      INSERT INTO update_actual_yield (crop_id, actual_yield) 
      VALUES (?, ?) 
      ON DUPLICATE KEY UPDATE actual_yield = VALUES(actual_yield)`;

    const [result] = await db.execute(query, [cropId, actualYield]);

    return NextResponse.json({ 
      message: "Actual yield updated successfully",
      affectedRows: result.affectedRows 
    }, { status: 200 });

  } catch (error) {
    console.error("Database Update Error:", error);
    // This will now catch if the 'update_actual_yield' table doesn't exist yet
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}