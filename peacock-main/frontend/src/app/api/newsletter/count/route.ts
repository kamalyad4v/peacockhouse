import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await getDb();
    const count = await db.collection('newsletter_signups').countDocuments({});
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching newsletter count:', error);
    return NextResponse.json({ detail: 'Internal Server Error' }, { status: 500 });
  }
}
