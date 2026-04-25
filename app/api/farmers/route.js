import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// ==========================
// GET
// ==========================
export async function GET() {
    try {
        const [rows] = await db.execute("SELECT * FROM farmer");

        const farmers = rows;

        let max = 0;

        for (let i = 0; i < farmers.length; i++) {
            const id = farmers[i].farmer_id;
            const num = parseInt(String(id).replace("F-", ""));
            if (!isNaN(num) && num > max) {
                max = num;
            }
        }

        const nextId = `F-${String(max + 1).padStart(3, '0')}`;

        return NextResponse.json({
            farmers: farmers,
            nextId: nextId
        });

    } catch (error) {
        console.error("Database Error:", error);
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
    try {
        const body = await request.json();

        const {
            farmer_id,
            farmer_name,
            contact_number,
            barangay,
            municipality,
            farm_size
        } = body;

        // ✅ VALIDATION
        if (!farmer_id || !farmer_name) {
            return NextResponse.json(
                { error: "Farmer ID and Name are required" },
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

        const [existing] = await db.execute(
            "SELECT farmer_id FROM farmer WHERE farmer_id = ?",
            [farmer_id]
        );

        // =====================
        // UPDATE
        // =====================
        if (existing.length > 0) {
            await db.execute(
                `UPDATE farmer 
                 SET farmer_name = ?, contact_number = ?, barangay = ?, 
                     municipality = ?, farm_size = ?
                 WHERE farmer_id = ?`,
                [
                    sqlVal(farmer_name),
                    sqlVal(contact_number),
                    sqlVal(barangay),
                    sqlVal(municipality),
                    sqlVal(farm_size),
                    farmer_id
                ]
            );

            return NextResponse.json(
                { message: "Farmer record updated!" },
                { status: 200 }
            );
        }

        // =====================
        // INSERT
        // =====================
        await db.execute(
            `INSERT INTO farmer 
            (farmer_id, farmer_name, contact_number, barangay, municipality, farm_size) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                sqlVal(farmer_id),
                sqlVal(farmer_name),
                sqlVal(contact_number),
                sqlVal(barangay),
                sqlVal(municipality),
                sqlVal(farm_size)
            ]
        );

        return NextResponse.json(
            { message: "New farmer registered!" },
            { status: 201 }
        );

    } catch (error) {
        console.error("Farmer POST Error:", error);

        return NextResponse.json(
            { error: error?.message || "Server error" },
            { status: 500 }
        );
    }
}