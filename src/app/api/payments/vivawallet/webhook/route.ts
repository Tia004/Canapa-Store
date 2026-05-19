import { NextResponse } from 'next/server';
import { updatePaymentStatus } from '@/lib/services/order.service';
import { PAYMENT_STATUS } from '@/lib/db/schema';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const payload = JSON.parse(body);

    // VivaWallet webhook event types: 1796 = Transaction Payment Created
    if (payload.EventTypeId === 1796) {
      const transactionId = payload.EventData?.TransactionId;
      const orderNumber = payload.EventData?.MerchantTrns;
      if (orderNumber && transactionId) {
        // Find order and update payment status
        const { getOrderByNumber } = await import('@/lib/services/order.service');
        const order = await getOrderByNumber(orderNumber);
        if (order) {
          await updatePaymentStatus(order.id, PAYMENT_STATUS.PAID, transactionId);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[VivaWallet] Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
