import { NextResponse } from 'next/server';
import { getOrderById, getOrderByNumber } from '@/lib/services/order.service';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    // Try by UUID first, then by order number
    const order = await getOrderById(id) ?? await getOrderByNumber(id);
    if (!order) return NextResponse.json({ error: 'Ordine non trovato' }, { status: 404 });
    return NextResponse.json({ success: true, data: { id: order.id, orderNumber: order.orderNumber, status: order.status, paymentStatus: order.paymentStatus, total: order.total, trackingNumber: order.trackingNumber, createdAt: order.createdAt } });
  } catch (error) {
    console.error('[Orders] GET error:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}
