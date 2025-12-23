import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.execute<RowDataPacket[]>(
            'SELECT * FROM goals WHERE user_id = ? ORDER BY created_at DESC',
            [session.userId]
        ); // Assumes getSession returns payload with userId
        return NextResponse.json(rows);
    } finally {
        connection.release();
    }
}

export async function POST(request: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { title } = await request.json();
    if (!title) return NextResponse.json({ error: 'Title required' }, { status: 400 });

    const connection = await pool.getConnection();
    try {
        await connection.execute(
            'INSERT INTO goals (user_id, title, progress) VALUES (?, ?, 0)',
            [(session as any).userId, title]
        );
        return NextResponse.json({ message: 'Goal added' }, { status: 201 });
    } finally {
        connection.release();
    }
}

export async function PUT(request: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await request.json();

    const connection = await pool.getConnection();
    try {
        // Update progress +10, max 100
        await connection.execute(
            'UPDATE goals SET progress = LEAST(progress + 10, 100) WHERE id = ? AND user_id = ?',
            [id, (session as any).userId]
        );
        return NextResponse.json({ message: 'Goal updated' });
    } finally {
        connection.release();
    }
}

export async function DELETE(request: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await request.json();

    const connection = await pool.getConnection();
    try {
        await connection.execute(
            'DELETE FROM goals WHERE id = ? AND user_id = ?',
            [id, (session as any).userId]
        );
        return NextResponse.json({ message: 'Goal deleted' });
    } finally {
        connection.release();
    }
}
