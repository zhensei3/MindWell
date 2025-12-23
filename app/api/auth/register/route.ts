import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { RowDataPacket } from 'mysql2';

export async function POST(request: Request) {
    try {
        const { username, email, password } = await request.json();

        if (!username || !email || !password) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const connection = await pool.getConnection();

        try {
            // Check existing
            const [rows] = await connection.execute<RowDataPacket[]>(
                'SELECT id FROM users WHERE username = ? OR email = ?',
                [username, email]
            );

            if (rows.length > 0) {
                return NextResponse.json({ error: 'Username or Email already exists' }, { status: 409 });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert
            await connection.execute(
                'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
                [username, email, hashedPassword]
            );

            return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Registration Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
