import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSession } from '@/lib/auth';

export async function POST() {
    const cookieStore = await cookies();
    cookieStore.delete('auth_token');
    return NextResponse.json({ message: 'Logged out' });
}

export async function GET() {
    const session = await getSession();
    if (session) {
        return NextResponse.json({ username: (session as any).username, userId: (session as any).userId });
    }
    return NextResponse.json({ error: 'Not logged in' }, { status: 401 });
}
