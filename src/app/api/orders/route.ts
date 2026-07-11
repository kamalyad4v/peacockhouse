import { NextRequest, NextResponse } from 'next/server';
import getSql from '@/lib/db';
import { jwtVerify } from 'jose';

export const dynamic = 'force-dynamic';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'peacock-secret-key-2024');

// Helper to get authenticated user from token
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

// GET /api/orders
// - Admin sees all orders
// - Customer sees only their own orders
export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sql = getSql();

    let orders;
    if (user.role === 'admin') {
      orders = await sql`
        SELECT o.*, u.name as customer_name, u.email as customer_email 
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
      `;
    } else {
      orders = await sql`
        SELECT * FROM orders 
        WHERE user_id = ${parseInt(user.id as string)} 
        ORDER BY created_at DESC
      `;
    }

    return NextResponse.json({ orders });
  } catch (err) {
    console.error('Orders GET error:', err);
    return NextResponse.json({ error: 'Internal server error', details: String(err) }, { status: 500 });
  }
}

// POST /api/orders
// - Create order
export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser(req);
    const body = await req.json();
    const { items, shipping_address } = body;

    if (!items || !Array.isArray(items) || items.length === 0 || !shipping_address) {
      return NextResponse.json({ error: 'Missing order items or shipping address' }, { status: 400 });
    }

    const sql = getSql();

    // 1. Fetch products from database to prevent price spoofing
    const productIds = items.map((item: any) => parseInt(item.product.id));
    if (productIds.some(isNaN)) {
      return NextResponse.json({ error: 'Invalid product IDs' }, { status: 400 });
    }

    // Fetch corresponding products
    const dbProducts = await sql`
      SELECT id, price, in_stock FROM products WHERE id = ANY(${productIds})
    `;

    // Map database price to items and verify stock
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const dbProd = dbProducts.find((p: any) => p.id === parseInt(item.product.id));
      if (!dbProd) {
        return NextResponse.json({ error: `Product with ID ${item.product.id} not found` }, { status: 404 });
      }
      if (!dbProd.in_stock) {
        return NextResponse.json({ error: `Product "${item.product.name}" is out of stock` }, { status: 400 });
      }

      const itemPrice = parseFloat(dbProd.price);
      const quantity = parseInt(item.quantity) || 1;
      subtotal += itemPrice * quantity;

      validatedItems.push({
        product: {
          id: dbProd.id,
          name: item.product.name,
          price: itemPrice,
          image_url: item.product.image_url,
          fabric: item.product.fabric || '',
          color: item.product.color || '',
        },
        quantity,
      });
    }

    // Calculate shipping (e.g. Free shipping above ₹15,000, else ₹250 flat rate)
    const shipping = subtotal > 15000 ? 0 : 250;
    const total = subtotal + shipping;

    // Associate order with logged-in user if available (otherwise guest checkout)
    const userId = user ? parseInt(user.id as string) : null;

    // Insert order (JSONB fields must be stringified for standard node-postgres / neon-serverless driver)
    const result = await sql`
      INSERT INTO orders (user_id, total, status, items, shipping_address)
      VALUES (
        ${userId}, 
        ${total}, 
        'pending', 
        ${JSON.stringify(validatedItems)}, 
        ${JSON.stringify(shipping_address)}
      )
      RETURNING *
    `;

    return NextResponse.json({ success: true, order: result[0] }, { status: 201 });
  } catch (err) {
    console.error('Orders POST error:', err);
    return NextResponse.json({ error: 'Internal server error', details: String(err) }, { status: 500 });
  }
}
