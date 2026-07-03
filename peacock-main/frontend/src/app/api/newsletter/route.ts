import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

interface NewsletterSignupDoc {
  id: string;
  email: string;
  created_at: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || !body.email || !/^\S+@\S+\.\S+$/.test(body.email)) {
      return NextResponse.json({ detail: 'Invalid email address' }, { status: 422 });
    }

    const emailLower = body.email.toLowerCase();
    const db = await getDb();

    const existing = await db.collection<NewsletterSignupDoc>('newsletter_signups').findOne({ email: emailLower });
    if (existing) {
      return NextResponse.json({ detail: 'Email already subscribed' }, { status: 409 });
    }

    const id = crypto.randomUUID();
    const created_at = new Date().toISOString();

    const doc: NewsletterSignupDoc = {
      id,
      email: emailLower,
      created_at
    };

    await db.collection<NewsletterSignupDoc>('newsletter_signups').insertOne({ ...doc });

    return NextResponse.json(doc, { status: 200 });
  } catch (error) {
    console.error('Error in newsletter signup:', error);
    return NextResponse.json({ detail: 'Internal Server Error' }, { status: 500 });
  }
}
