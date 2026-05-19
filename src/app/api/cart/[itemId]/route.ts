import { NextResponse } from 'next/server';
import { updateCartItemSchema } from '@/lib/validators/cart.schema';
import { updateCartItem, removeCartItem } from '@/lib/services/cart.service';
import { getCartSession } from '@/lib/auth/cookies';
import { authenticateRequest } from '@/lib/auth/middleware';

export async function PATCH(request: Request, { params }: { params: Promise<{ itemId: string }> }) {
  try {
    const { itemId } = await params;
    const body = await request.json();
    const parsed = updateCartItemSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Dati non validi' }, { status: 400 });

    const user = await authenticateRequest();
    const sessionId = user ? undefined : await getCartSession();
    const updated = await updateCartItem(itemId, parsed.data.quantity, sessionId, user?.sub);
    if (!updated) return NextResponse.json({ error: 'Elemento non trovato' }, { status: 404 });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('[Cart] PATCH error:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ itemId: string }> }) {
  try {
    const { itemId } = await params;
    const user = await authenticateRequest();
    const sessionId = user ? undefined : await getCartSession();
    const deleted = await removeCartItem(itemId, sessionId, user?.sub);
    if (!deleted) return NextResponse.json({ error: 'Elemento non trovato' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Cart] DELETE error:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}
