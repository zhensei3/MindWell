import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

export async function GET(request: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 5;
    const offset = (page - 1) * limit;

    const connection = await pool.getConnection();
    try {
        // Get total
        const [countRows] = await connection.execute<RowDataPacket[]>(
            'SELECT COUNT(*) as total FROM moods WHERE user_id = ?',
            [(session as any).userId]
        );
        const total = countRows[0].total;

        // Get Data
        const [rows] = await connection.execute<RowDataPacket[]>(
            'SELECT * FROM moods WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
            [(session as any).userId, limit, offset]
        );

        return NextResponse.json({
            moods: rows,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } finally {
        connection.release();
    }
}

export async function POST(request: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { mood_score, note } = await request.json();

    if (!mood_score) return NextResponse.json({ error: 'Score required' }, { status: 400 });

    const connection = await pool.getConnection();
    try {
        await connection.execute(
            'INSERT INTO moods (user_id, mood_score, note) VALUES (?, ?, ?)',
            [(session as any).userId, mood_score, note || '']
        );
        return NextResponse.json({ message: 'Mood logged' }, { status: 201 });
    } finally {
        connection.release();
    }
}
