import { NextResponse } from 'next/server';
import { createShipment } from '@/lib/services/shipping.service';
import { getOrderById } from '@/lib/services/order.service';
import { requireAdmin } from '@/lib/auth/middleware';
import type { OrderAddress } from '@/lib/db/schema';

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const { orderId, shippingMethodId, weight } = await request.json();
    if (!orderId || !shippingMethodId) return NextResponse.json({ error: 'Parametri mancanti' }, { status: 400 });

    const order = await getOrderById(orderId);
    if (!order) return NextResponse.json({ error: 'Ordine non trovato' }, { status: 404 });

    const addr = order.shippingAddress as OrderAddress;
    const label = await createShipment({
      id: order.id,
      orderNumber: order.orderNumber,
      shippingAddress: addr,
      weight: weight ?? 500,
      shippingMethodId,
    });

    return NextResponse.json({ success: true, data: label });
  } catch (error) {
    if (error instanceof Response) return NextResponse.json(await error.json(), { status: error.status });
    console.error('[Shipping] Create error:', error);
    return NextResponse.json({ error: 'Errore nella creazione della spedizione' }, { status: 500 });
  }
}
