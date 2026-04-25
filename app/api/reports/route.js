import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { crop_id, total_yield, total_production } = await request.json();

        // Match the columns exactly: report_id (AI), total_yield, total_production, crop_id
        const [result] = await db.execute(
            "INSERT INTO report (total_yield, total_production, crop_id) VALUES (?, ?, ?)",
            [total_yield || 0, total_production || 0, crop_id]
        );

        return NextResponse.json({ success: true, id: result.insertId });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}