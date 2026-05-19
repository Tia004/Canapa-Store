import { NextResponse } from 'next/server';
import { createProductSchema } from '@/lib/validators/product.schema';
import { getProducts, createProduct } from '@/lib/services/product.service';
import { productQuerySchema } from '@/lib/validators/product.schema';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = productQuerySchema.parse(Object.fromEntries(searchParams));
    // Admin sees all products, including inactive
    const result = await getProducts({ ...query, featured: undefined });
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('[Admin] Products GET error:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createProductSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Dati non validi', details: parsed.error.flatten() }, { status: 400 });

    const product = await createProduct(parsed.data);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.error('[Admin] Products POST error:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}
