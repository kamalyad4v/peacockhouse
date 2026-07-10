import { NextRequest, NextResponse } from 'next/server';
import getSql from '@/lib/db';
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

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sql = getSql();
    const products = await sql`SELECT * FROM products WHERE id = ${parseInt(params.id)}`;
    if (!products.length) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ product: products[0] });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error', details: String(err) }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const sql = getSql();
    const body = await req.json();
    const { name, description, price, original_price, category, fabric, color, image_url, images, in_stock, featured } = body;

    const result = await sql`
      UPDATE products SET
        name = ${name},
        description = ${description},
        price = ${price},
        original_price = ${original_price || null},
        category = ${category},
        fabric = ${fabric},
        color = ${color},
        image_url = ${image_url},
        images = ${images || []},
        in_stock = ${in_stock !== undefined ? in_stock : true},
        featured = ${featured || false},
        updated_at = NOW()
      WHERE id = ${parseInt(params.id)}
      RETURNING *
    `;

    if (!result.length) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ product: result[0] });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error', details: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const sql = getSql();
    await sql`DELETE FROM products WHERE id = ${parseInt(params.id)}`;
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error', details: String(err) }, { status: 500 });
  }
}
