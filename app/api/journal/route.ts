import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getSession } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

export async function GET(request: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 5;
    const offset = (page - 1) * limit;

    const connection = await pool.getConnection();
    try {
        let countSql = 'SELECT COUNT(*) as total FROM journals WHERE user_id = ?';
        let params: any[] = [(session as any).userId];

        if (search) {
            countSql += ' AND (title LIKE ? OR content LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        const [countRows] = await connection.execute<RowDataPacket[]>(countSql, params);
        const total = countRows[0].total;

        let fetchSql = 'SELECT * FROM journals WHERE user_id = ?';
        let fetchParams: any[] = [(session as any).userId];

        if (search) {
            fetchSql += ' AND (title LIKE ? OR content LIKE ?)';
            fetchParams.push(`%${search}%`, `%${search}%`);
        }

        fetchSql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        fetchParams.push(limit, offset);

        // Using query instead of execute for LIMIT/OFFSET stability with dynamic params
        // Actually let's use execute but cast to numbers
        const [rows] = await connection.query<RowDataPacket[]>(fetchSql, fetchParams);

        return NextResponse.json({
            entries: rows,
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

    const { title, content } = await request.json();

    if (!title || !content) return NextResponse.json({ error: 'Title and Content required' }, { status: 400 });

    const connection = await pool.getConnection();
    try {
        await connection.execute(
            'INSERT INTO journals (user_id, title, content) VALUES (?, ?, ?)',
            [(session as any).userId, title, content]
        );
        return NextResponse.json({ message: 'Entry created' }, { status: 201 });
    } finally {
        connection.release();
    }
}

export async function PUT(request: Request) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id, title, content } = await request.json();

    const connection = await pool.getConnection();
    try {
        await connection.execute(
            'UPDATE journals SET title = ?, content = ? WHERE id = ? AND user_id = ?',
            [title, content, id, (session as any).userId]
        );
        return NextResponse.json({ message: 'Entry updated' });
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
            'DELETE FROM journals WHERE id = ? AND user_id = ?',
            [id, (session as any).userId]
        );
        return NextResponse.json({ message: 'Entry deleted' });
    } finally {
        connection.release();
    }
}
