import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// ==========================
// GET
// ==========================
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const cropId = searchParams.get('cropId');

    const selectFields = `
      c.crop_id, c.planting_date, c.growth_stage, c.expected_harvest_date, 
      c.estimated_yield, c.production_cost, c.seed_type, c.farmer_id,
      u.actual_yield,
      r.total_production, r.total_yield AS report_yield
    `;
    
    const joinLogic = `
      FROM crop c
      LEFT JOIN update_actual_yield u ON c.crop_id = u.crop_id
      LEFT JOIN report r ON c.crop_id = r.crop_id
    `;

    if (cropId) {
      const [rows] = await db.execute(
        `SELECT ${selectFields} ${joinLogic} WHERE c.crop_id = ? LIMIT 1`, 
        [cropId]
      );

      if (rows.length === 0) {
        return NextResponse.json(
          { error: "Crop ID not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(rows[0]);
    }

    const [rows] = await db.execute(`
      SELECT ${selectFields} ${joinLogic}
      ORDER BY c.crop_id DESC
    `);

    return NextResponse.json(rows || []);

  } catch (error) {
    console.error("Fetch Error:", error);

    return NextResponse.json(
      { error: error?.message || "Server error" },
      { status: 500 }
    );
  }
}


// ==========================
// POST
// ==========================
export async function POST(request) {
  let body; // ✅ fix for catch access

  try {
    body = await request.json();

    const {
      cropId, productionCost, plantingDate, seedType, 
      growthStage, fertilizerType, quantityApplied, 
      applicationDate, irrigationMethod, expectedHarvest, 
      estimatedYield, marketPrice, farmerId 
    } = body;

    // =====================
    // ✅ VALIDATION
    // =====================
    if (!cropId) {
      return NextResponse.json(
        { error: "Crop ID is required" },
        { status: 400 }
      );
    }

    // =====================
    // CLEAN NUMBER
    // =====================
    const cleanNumber = (val) => {
      if (val === undefined || val === null || val === '') return 0;
      const cleaned = String(val).replace(/[^0-9.]/g, '');

      const num = parseFloat(cleaned);
      return isNaN(num) || num < 0 ? 0 : num; // ✅ prevent negative
    };

    const sqlVal = (val) =>
      val === undefined || val === '' ? null : val;

    const query = `
      INSERT INTO crop (
        crop_id, production_cost, planting_date, seed_type, 
        growth_stage, fertilizer_type, quantity_applied, 
        application_date, irrigation_method, expected_harvest_date, 
        estimated_yield, market_price, farmer_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      sqlVal(cropId), 
      cleanNumber(productionCost), 
      sqlVal(plantingDate), 
      sqlVal(seedType), 
      sqlVal(growthStage), 
      sqlVal(fertilizerType), 
      sqlVal(quantityApplied), 
      sqlVal(applicationDate), 
      sqlVal(irrigationMethod), 
      sqlVal(expectedHarvest), 
      cleanNumber(estimatedYield),
      cleanNumber(marketPrice),
      sqlVal(farmerId || 'F-001')
    ];

    await db.execute(query, values);

    return NextResponse.json(
      { message: "Crop record saved successfully" },
      { status: 201 }
    );

  } catch (error) {
    console.error("Database Insert Error:", error);

    // ✅ FIX: avoid crash if body undefined
    if (error.code === 'ER_DUP_ENTRY') {
      return NextResponse.json(
        { error: `Crop ID already exists. Use a unique ID.` },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: error?.message || "Server error" },
      { status: 500 }
    );
  }
}


// ==========================
// PUT: Update Actual Yield
// ==========================
export async function PUT(request) {
  try {
    const { cropId, actualYield } = await request.json();

    // ✅ VALIDATION
    if (!cropId || actualYield === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (isNaN(Number(actualYield)) || Number(actualYield) < 0) {
      return NextResponse.json(
        { error: "Invalid actual yield" },
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO update_actual_yield (actual_yield, crop_id) 
      VALUES (?, ?) 
      ON DUPLICATE KEY UPDATE actual_yield = VALUES(actual_yield)
    `;

    await db.execute(query, [Number(actualYield), cropId]);

    return NextResponse.json(
      { message: "Actual yield updated successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Database Update Error:", error);

    return NextResponse.json(
      { error: error?.message || "Server error" },
      { status: 500 }
    );
  }
}