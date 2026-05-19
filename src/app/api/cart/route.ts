import { NextResponse } from 'next/server';
import { addToCartSchema } from '@/lib/validators/cart.schema';
import { getCart, addToCart } from '@/lib/services/cart.service';
import { getOrCreateCartSession } from '@/lib/auth/cookies';
import { authenticateRequest } from '@/lib/auth/middleware';

export async function GET() {
  try {
    const user = await authenticateRequest();
    const sessionId = user ? undefined : await getOrCreateCartSession();
    const cart = await getCart(sessionId, user?.sub);
    return NextResponse.json({ success: true, data: cart });
  } catch (error) {
    console.error('[Cart] GET error:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = addToCartSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Dati non validi', details: parsed.error.flatten() }, { status: 400 });

    const user = await authenticateRequest();
    const sessionId = user ? undefined : await getOrCreateCartSession();
    const item = await addToCart(parsed.data, sessionId, user?.sub);
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error('[Cart] POST error:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}
