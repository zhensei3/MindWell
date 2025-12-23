import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { RowDataPacket } from 'mysql2';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
        }

        const connection = await pool.getConnection();

        try {
            const [rows] = await connection.execute<RowDataPacket[]>(
                'SELECT id, username, password_hash FROM users WHERE email = ?',
                [email]
            );

            if (rows.length === 0) {
                return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
            }

            const user = rows[0];
            const match = await bcrypt.compare(password, user.password_hash);

            if (!match) {
                return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
            }

            // Create Session
            const token = signToken({ userId: user.id, username: user.username });

            const cookieStore = await cookies();
            cookieStore.set('auth_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24, // 1 day
                path: '/',
            });

            return NextResponse.json({ message: 'Login successful', user: { username: user.username } });
        } finally {
            connection.release();
        }

    } catch (error) {
        console.error('Login Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
