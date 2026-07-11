import { NextRequest, NextResponse } from 'next/server';
import getSql from '@/lib/db';
import { jwtVerify } from 'jose';

export const dynamic = 'force-dynamic';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'peacock-secret-key-2024');

// Helper to check if requester is admin
async function getAuthUser(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  try {
    const { payload } = await jwtVerify(auth.slice(7), JWT_SECRET);
    return payload;
  } catch {
    return null;
  }
}

// GET /api/orders/[id]
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sql = getSql();
    const orders = await sql`
      SELECT o.*, u.name as customer_name, u.email as customer_email 
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = ${parseInt(params.id)}
    `;

    if (!orders.length) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const order = orders[0];

    // Authorize: Only admin or the customer who placed the order can view it
    if (user.role !== 'admin' && order.user_id !== parseInt(user.id as string)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ order });
  } catch (err) {
    console.error('Order GET error:', err);
    return NextResponse.json({ error: 'Internal server error', details: String(err) }, { status: 500 });
  }
}

// PUT /api/orders/[id] (admin only)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getAuthUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const sql = getSql();
    const result = await sql`
      UPDATE orders 
      SET status = ${status} 
      WHERE id = ${parseInt(params.id)} 
      RETURNING *
    `;

    if (!result.length) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: result[0] });
  } catch (err) {
    console.error('Order PUT error:', err);
    return NextResponse.json({ error: 'Internal server error', details: String(err) }, { status: 500 });
  }
}
