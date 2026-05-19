import { NextResponse } from 'next/server';
import { updatePaymentStatus, getOrderById } from '@/lib/services/order.service';
import { PAYMENT_STATUS, ORDER_STATUS } from '@/lib/db/schema';
import { requireAdmin } from '@/lib/auth/middleware';

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const { orderId, bankReference } = await request.json();
    if (!orderId) return NextResponse.json({ error: 'ID ordine richiesto' }, { status: 400 });

    await updatePaymentStatus(orderId, PAYMENT_STATUS.PAID, bankReference);
    const { updateOrderStatus } = await import('@/lib/services/order.service');
    await updateOrderStatus(orderId, ORDER_STATUS.CONFIRMED);

    return NextResponse.json({ success: true, message: 'Pagamento bonifico confermato' });
  } catch (error) {
    if (error instanceof Response) return NextResponse.json(await error.json(), { status: error.status });
    console.error('[BankTransfer] Confirm error:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}
