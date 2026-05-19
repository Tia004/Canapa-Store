import { NextResponse } from 'next/server';
import { productQuerySchema } from '@/lib/validators/product.schema';
import { getProducts } from '@/lib/services/product.service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = productQuerySchema.parse(Object.fromEntries(searchParams));
    const result = await getProducts(query);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('[Products] GET error:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}
