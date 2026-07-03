import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }
    const db = await getDb();
    const existing = await db.collection('newsletter_signups').findOne({ email });
    if (existing) {
      return NextResponse.json({ error: 'Already subscribed' }, { status: 409 });
    }
    await db.collection('newsletter_signups').insertOne({ email, createdAt: new Date() });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Newsletter signup error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
