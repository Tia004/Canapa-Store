import { NextResponse } from 'next/server';
import { getProductBySlug } from '@/lib/services/product.service';

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    if (!product) return NextResponse.json({ error: 'Prodotto non trovato' }, { status: 404 });
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('[Products] Slug GET error:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}
