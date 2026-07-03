import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

interface StatusCheckDoc {
  id: string;
  client_name: string;
  timestamp: string | Date;
}

export async function GET() {
  try {
    const db = await getDb();
    const checks = await db.collection<StatusCheckDoc>('status_checks')
      .find({}, { projection: { _id: 0 } })
      .toArray();

    const formattedChecks = checks.map(check => {
      let ts = check.timestamp;
      if (ts instanceof Date) {
        ts = ts.toISOString();
      }
      return {
        id: check.id,
        client_name: check.client_name,
        timestamp: ts
      };
    });

    return NextResponse.json(formattedChecks);
  } catch (error) {
    console.error('Error fetching status checks:', error);
    return NextResponse.json({ detail: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || !body.client_name) {
      return NextResponse.json({ detail: 'client_name is required' }, { status: 422 });
    }

    const db = await getDb();
    const id = crypto.randomUUID();
    const timestamp = new Date().toISOString();

    const doc: StatusCheckDoc = {
      id,
      client_name: body.client_name,
      timestamp
    };

    await db.collection<StatusCheckDoc>('status_checks').insertOne({ ...doc });

    return NextResponse.json(doc);
  } catch (error) {
    console.error('Error creating status check:', error);
    return NextResponse.json({ detail: 'Internal Server Error' }, { status: 500 });
  }
}
