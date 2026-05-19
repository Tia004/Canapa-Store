import { NextResponse } from 'next/server';
import { updateOrderStatusSchema } from '@/lib/validators/order.schema';
import { getOrderById, updateOrderStatus } from '@/lib/services/order.service';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const order = await getOrderById(id);
    if (!order) return NextResponse.json({ error: 'Ordine non trovato' }, { status: 404 });
    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error('[Admin] Order GET error:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateOrderStatusSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Dati non validi', details: parsed.error.flatten() }, { status: 400 });

    const updated = await updateOrderStatus(id, parsed.data.status, parsed.data.adminNotes, parsed.data.trackingNumber);
    if (!updated) return NextResponse.json({ error: 'Ordine non trovato' }, { status: 404 });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('[Admin] Order PATCH error:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}
