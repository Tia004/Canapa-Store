import { NextResponse } from 'next/server';
import { updateProductSchema } from '@/lib/validators/product.schema';
import { getProductById, updateProduct, deleteProduct } from '@/lib/services/product.service';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await getProductById(id);
    if (!product) return NextResponse.json({ error: 'Prodotto non trovato' }, { status: 404 });
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('[Admin] Product GET error:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateProductSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Dati non validi', details: parsed.error.flatten() }, { status: 400 });

    const updated = await updateProduct(id, parsed.data);
    if (!updated) return NextResponse.json({ error: 'Prodotto non trovato' }, { status: 404 });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('[Admin] Product PATCH error:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const deleted = await deleteProduct(id);
    if (!deleted) return NextResponse.json({ error: 'Prodotto non trovato' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Admin] Product DELETE error:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}
