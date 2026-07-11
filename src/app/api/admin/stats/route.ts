import { NextRequest, NextResponse } from 'next/server';
import getSql from '@/lib/db';
import { jwtVerify } from 'jose';

export const dynamic = 'force-dynamic';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'peacock-secret-key-2024');

async function isAdmin(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return false;
  try {
    const { payload } = await jwtVerify(auth.slice(7), JWT_SECRET);
    return payload.role === 'admin';
  } catch {
    return false;
  }
}

// GET /api/admin/stats
export async function GET(req: NextRequest) {
  try {
    if (!(await isAdmin(req))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sql = getSql();

    // Fetch counts
    const productsRes = await sql`SELECT COUNT(*)::integer as count FROM products`;
    const ordersRes = await sql`SELECT COUNT(*)::integer as count FROM orders`;
    const usersRes = await sql`SELECT COUNT(*)::integer as count FROM users`;

    // Fetch total revenue (sum of non-cancelled orders)
    const revenueRes = await sql`
      SELECT SUM(total)::numeric as sum FROM orders WHERE status != 'cancelled'
    `;

    // Fetch recent orders
    const recentOrders = await sql`
      SELECT o.*, u.name as customer_name, u.email as customer_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
      LIMIT 5
    `;

    const productsCount = productsRes[0]?.count || 0;
    const ordersCount = ordersRes[0]?.count || 0;
    const usersCount = (usersRes[0]?.count || 0) + 1; // Include admin as a user, or just user count
    const totalRevenue = parseFloat(revenueRes[0]?.sum || '0');

    return NextResponse.json({
      success: true,
      stats: {
        products: productsCount,
        orders: ordersCount,
        users: usersCount,
        revenue: totalRevenue,
      },
      recentOrders,
    });
  } catch (err) {
    console.error('Admin stats GET error:', err);
    return NextResponse.json({ error: 'Internal server error', details: String(err) }, { status: 500 });
  }
}
