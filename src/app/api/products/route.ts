import { NextRequest, NextResponse } from 'next/server';
import getSql, { initDB } from '@/lib/db';
import { jwtVerify } from 'jose';

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

// GET /api/products
export async function GET(req: NextRequest) {
  try {
    const sql = getSql();
    await initDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');

    let products;
    if (category && category !== 'all') {
      products = await sql`SELECT * FROM products WHERE category = ${category} AND in_stock = true ORDER BY created_at DESC`;
    } else if (featured === 'true') {
      products = await sql`SELECT * FROM products WHERE featured = true AND in_stock = true ORDER BY created_at DESC`;
    } else if (search) {
      products = await sql`SELECT * FROM products WHERE (name ILIKE ${'%' + search + '%'} OR description ILIKE ${'%' + search + '%'}) AND in_stock = true ORDER BY created_at DESC`;
    } else {
      products = await sql`SELECT * FROM products WHERE in_stock = true ORDER BY created_at DESC`;
    }

    return NextResponse.json({ products });
  } catch (err) {
    console.error('Products GET error:', err);
    return NextResponse.json({ error: 'Internal server error', details: String(err) }, { status: 500 });
  }
}

// POST /api/products (admin only)
export async function POST(req: NextRequest) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const sql = getSql();
    const body = await req.json();
    const { name, description, price, original_price, category, fabric, color, image_url, images, featured } = body;

    const result = await sql`
      INSERT INTO products (name, description, price, original_price, category, fabric, color, image_url, images, featured)
      VALUES (${name}, ${description}, ${price}, ${original_price || null}, ${category}, ${fabric}, ${color}, ${image_url}, ${images || []}, ${featured || false})
      RETURNING *
    `;

    return NextResponse.json({ product: result[0] }, { status: 201 });
  } catch (err) {
    console.error('Products POST error:', err);
    return NextResponse.json({ error: 'Internal server error', details: String(err) }, { status: 500 });
  }
}
