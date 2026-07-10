import { NextRequest, NextResponse } from 'next/server';
import getSql from '@/lib/db';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

const ADMIN_EMAIL = 'admin@peacock.house';
const ADMIN_PASSWORD = 'peacock@admin2024';
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'peacock-secret-key-2024');

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    // Admin login — no DB needed
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = await new SignJWT({ id: 0, email, role: 'admin' })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
        .sign(JWT_SECRET);
      return NextResponse.json({ token, user: { id: 0, name: 'Admin', email, role: 'admin' } });
    }

    // Regular user login
    const sql = getSql();
    const users = await sql`SELECT * FROM users WHERE email = ${email}`;
    const user = users[0];

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await new SignJWT({ id: user.id, email: user.email, role: user.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(JWT_SECRET);

    return NextResponse.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Internal server error', details: String(err) }, { status: 500 });
  }
}
