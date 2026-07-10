import { NextRequest, NextResponse } from 'next/server';
import getSql, { initDB } from '@/lib/db';

const SEED_PRODUCTS = [
  {
    name: 'Kanjivaram Silk Saree',
    description: 'Handwoven pure silk saree from Kanchipuram with intricate golden zari work. A timeless masterpiece perfect for weddings and grand occasions.',
    price: 18500, original_price: 22000, category: 'Silk', fabric: 'Pure Silk', color: 'Ruby Red',
    image_url: '/sarees/saree_kanjivaram_red.png',
    images: ['/sarees/saree_kanjivaram_red.png'],
    in_stock: true, featured: true,
  },
  {
    name: 'Banarasi Brocade Saree',
    description: 'Opulent Banarasi saree with rich brocade weaving and silver zari motifs. A heritage piece from the looms of Varanasi.',
    price: 24000, original_price: 28000, category: 'Silk', fabric: 'Brocade Silk', color: 'Royal Blue',
    image_url: '/sarees/saree_banarasi_blue.png',
    images: ['/sarees/saree_banarasi_blue.png'],
    in_stock: true, featured: true,
  },
  {
    name: 'Mysore Crepe Silk Saree',
    description: 'Lightweight crepe silk saree from Mysore with minimal yet elegant border work. Perfect for office wear and formal events.',
    price: 8500, original_price: 10000, category: 'Silk', fabric: 'Crepe Silk', color: 'Peacock Green',
    image_url: '/sarees/saree_mysore_green.png',
    images: ['/sarees/saree_mysore_green.png'],
    in_stock: true, featured: true,
  },
  {
    name: 'Chanderi Cotton Saree',
    description: 'Delicate Chanderi saree with a fine cotton-silk blend. Features traditional butis and a sheer pallu for an ethereal look.',
    price: 4500, original_price: 5500, category: 'Cotton', fabric: 'Chanderi Cotton-Silk', color: 'Ivory White',
    image_url: '/sarees/saree_chanderi_ivory.png',
    images: ['/sarees/saree_chanderi_ivory.png'],
    in_stock: true, featured: false,
  },
  {
    name: 'Patola Silk Saree',
    description: "Rare double ikat Patola saree from Gujarat with geometric patterns woven using resist-dyeing technique. A collector's piece.",
    price: 35000, original_price: 42000, category: 'Silk', fabric: 'Pure Silk', color: 'Saffron & Maroon',
    image_url: '/sarees/saree_patola_saffron.png',
    images: ['/sarees/saree_patola_saffron.png'],
    in_stock: true, featured: true,
  },
  {
    name: 'Pochampally Ikat Saree',
    description: 'Geometric ikat-patterned saree from Telangana with bold diamond motifs. Hand-dyed and handwoven on traditional looms.',
    price: 6800, original_price: 8000, category: 'Cotton', fabric: 'Cotton Ikat', color: 'Indigo Blue',
    image_url: '/sarees/saree_pochampally_indigo.png',
    images: ['/sarees/saree_pochampally_indigo.png'],
    in_stock: true, featured: false,
  },
  {
    name: 'Sambalpuri Bandha Saree',
    description: 'Traditional tie-and-dye Sambalpuri saree from Odisha featuring temple motifs and fish, conch, and flower patterns.',
    price: 7200, original_price: 9000, category: 'Cotton', fabric: 'Cotton-Silk Blend', color: 'Forest Green',
    image_url: '/sarees/saree_sambalpuri_green.png',
    images: ['/sarees/saree_sambalpuri_green.png'],
    in_stock: true, featured: false,
  },
  {
    name: 'Kota Doria Saree',
    description: 'Lightweight Kota Doria saree from Rajasthan with a distinct square-weave texture. Perfect for summer occasions.',
    price: 3200, original_price: 4000, category: 'Cotton', fabric: 'Cotton-Silk Kota', color: 'Blush Pink',
    image_url: '/sarees/saree_kota_pink.png',
    images: ['/sarees/saree_kota_pink.png'],
    in_stock: true, featured: false,
  },
  {
    name: 'Tussar Ghicha Silk Saree',
    description: 'Wild silk saree from Jharkhand with textured Ghicha yarn weaving. Natural golden sheen with tribal embroidery.',
    price: 9800, original_price: 12000, category: 'Silk', fabric: 'Tussar Silk', color: 'Natural Gold',
    image_url: '/sarees/saree_tussar_gold.png',
    images: ['/sarees/saree_tussar_gold.png'],
    in_stock: true, featured: true,
  },
  {
    name: 'Madhubani Handpainted Saree',
    description: 'Hand-painted cotton saree with traditional Madhubani art from Bihar. Each piece is unique with mythological motifs.',
    price: 5500, original_price: 7000, category: 'Handcrafted', fabric: 'Cotton', color: 'Multicolor',
    image_url: '/sarees/saree_madhubani_painted.png',
    images: ['/sarees/saree_madhubani_painted.png'],
    in_stock: true, featured: false,
  },
  {
    name: 'Kashmiri Pashmina Embroidered Saree',
    description: 'Luxurious pashmina saree with hand-embroidered Sozni work from Kashmir. The finest needlework on the softest fabric.',
    price: 45000, original_price: 55000, category: 'Designer', fabric: 'Pashmina', color: 'Winter White',
    image_url: '/sarees/saree_pashmina_white.png',
    images: ['/sarees/saree_pashmina_white.png'],
    in_stock: true, featured: true,
  },
  {
    name: 'Organza Saree with Embroidery',
    description: 'Sheer organza saree with intricate sequin and thread embroidery. Perfect for parties and cocktail events.',
    price: 12000, original_price: 15000, category: 'Designer', fabric: 'Organza', color: 'Midnight Black',
    image_url: '/sarees/saree_organza_black.png',
    images: ['/sarees/saree_organza_black.png'],
    in_stock: true, featured: true,
  },
];

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-seed-secret');
  if (secret !== (process.env.SEED_SECRET || 'seed-peacock-2024')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const sql = getSql();
    await initDB();

    await sql`DELETE FROM products`;

    for (const p of SEED_PRODUCTS) {
      await sql`
        INSERT INTO products (name, description, price, original_price, category, fabric, color, image_url, images, in_stock, featured)
        VALUES (${p.name}, ${p.description}, ${p.price}, ${p.original_price}, ${p.category}, ${p.fabric}, ${p.color}, ${p.image_url}, ${p.images}, ${p.in_stock}, ${p.featured})
      `;
    }

    return NextResponse.json({ success: true, count: SEED_PRODUCTS.length, message: `Seeded ${SEED_PRODUCTS.length} products with real saree images` });
  } catch (err) {
    console.error('Seed error:', err);
    return NextResponse.json({ error: 'Seed failed', details: String(err) }, { status: 500 });
  }
}
