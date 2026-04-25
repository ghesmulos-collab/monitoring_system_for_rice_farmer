import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// ==========================
// GET: Fetch One Farmer
// ==========================
export async function GET(request, { params }) {
    try {
        // ❌ remove await (params is not a Promise)
        const { id } = params;

        const [rows] = await db.execute(
            "SELECT * FROM farmer WHERE farmer_id = ?",
            [id]
        );

        if (rows.length === 0) {
            return NextResponse.json(
                { error: "Farmer not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(rows[0]);

    } catch (error) {
        return NextResponse.json(
            { error: error?.message || "Server error" },
            { status: 500 }
        );
    }
}


// ==========================
// PUT: Update Farmer
// ==========================
export async function PUT(request, { params }) {
    try {
        // ❌ remove await
        const { id } = params;

        const body = await request.json();

        const {
            farmer_name,
            contact_number,
            barangay,
            municipality,
            farm_size,
            registration_date
        } = body;

        // =====================
        // ✅ VALIDATION (same as your main API)
        // =====================
        if (!farmer_name) {
            return NextResponse.json(
                { error: "Farmer name is required" },
                { status: 400 }
            );
        }

        if (/[^a-zA-Z\s.'-]/.test(farmer_name)) {
            return NextResponse.json(
                { error: "Invalid farmer name" },
                { status: 400 }
            );
        }

        if (contact_number && /[^0-9]/.test(contact_number)) {
            return NextResponse.json(
                { error: "Contact must be numbers only" },
                { status: 400 }
            );
        }

        if (farm_size && isNaN(Number(farm_size))) {
            return NextResponse.json(
                { error: "Invalid farm size" },
                { status: 400 }
            );
        }

        const sqlVal = (val) =>
            val === undefined || val === "" ? null : val;

        const query = `
            UPDATE farmer 
            SET farmer_name = ?, 
                contact_number = ?, 
                barangay = ?, 
                municipality = ?, 
                farm_size = ?, 
                registration_date = ?
            WHERE farmer_id = ?
        `;

        const [result] = await db.execute(query, [
            sqlVal(farmer_name),
            sqlVal(contact_number),
            sqlVal(barangay),
            sqlVal(municipality),
            sqlVal(farm_size),
            sqlVal(registration_date),
            id
        ]);

        if (result.affectedRows === 0) {
            return NextResponse.json(
                { error: "Farmer not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: "Updated" });

    } catch (error) {
        return NextResponse.json(
            { error: error?.message || "Server error" },
            { status: 500 }
        );
    }
}