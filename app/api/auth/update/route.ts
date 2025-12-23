import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { getSession } from '@/lib/auth';
import { RowDataPacket } from 'mysql2';

export async function PUT(request: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { username, email, password, newPassword } = await request.json();

        if (!username && !email && !newPassword) {
            return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
        }

        const connection = await pool.getConnection();

        try {
            // Get current user data
            const [rows] = await connection.execute<RowDataPacket[]>(
                'SELECT id, password_hash FROM users WHERE id = ?',
                [session.userId]
            );

            if (rows.length === 0) {
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }

            const user = rows[0];
            const updates: string[] = [];
            const values: any[] = [];

            if (username) {
                updates.push('username = ?');
                values.push(username);
            }

            if (email) {
                updates.push('email = ?');
                values.push(email);
            }

            if (newPassword) {
                if (!password) {
                    return NextResponse.json({ error: 'Current password required to set new password' }, { status: 400 });
                }

                const match = await bcrypt.compare(password, user.password_hash);
                if (!match) {
                    return NextResponse.json({ error: 'Incorrect current password' }, { status: 400 });
                }

                const hashedPassword = await bcrypt.hash(newPassword, 10);
                updates.push('password_hash = ?');
                values.push(hashedPassword);
            }

            if (updates.length > 0) {
                values.push(session.userId);
                await connection.execute(
                    `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
                    values
                );
            }

            return NextResponse.json({ message: 'Profile updated successfully' });

        } finally {
            connection.release();
        }

    } catch (error) {
        console.error('Update Profile Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
