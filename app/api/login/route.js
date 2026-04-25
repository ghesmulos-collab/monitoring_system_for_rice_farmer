import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { success: false, error: "Username and password are required" },
                { status: 400 }
            );
        }

        // FIXED QUERY:
        // Table: user_account
        // Column 1: Username
        // Column 2: password (updated from Password_Hash)
        const [rows] = await db.query(
            'SELECT Username, Farmer_ID FROM user_account WHERE Username = ? AND password = ?', 
            [username, password]
        );

        if (rows.length > 0) {
            const user = rows[0];
            return NextResponse.json({ 
                success: true, 
                message: "Login successful",
                user: {
                    // Matching the exact column names from your SQL schema
                    username: user.Username,
                    farmerId: user.Farmer_ID
                } 
            });
        } else {
            return NextResponse.json(
                { success: false, error: "Invalid username or password" }, 
                { status: 401 }
            );
        }

    } catch (error) {
        // Logs the error to your terminal for debugging
        console.error("DATABASE ERROR:", error.message);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" }, 
            { status: 500 }
        );
    }
}