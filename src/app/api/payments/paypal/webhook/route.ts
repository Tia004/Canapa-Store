import { NextResponse } from 'next/server';
import { verifyPayPalWebhook } from '@/lib/payments/paypal';
import { updatePaymentStatus, getOrderByNumber } from '@/lib/services/order.service';
import { PAYMENT_STATUS } from '@/lib/db/schema';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const headers: Record<string, string> = {};
    request.headers.forEach((v, k) => { headers[k] = v; });

    const verified = await verifyPayPalWebhook(headers, body);
    if (!verified) return NextResponse.json({ error: 'Invalid webhook' }, { status: 401 });

    const event = JSON.parse(body);
    if (event.event_type === 'CHECKOUT.ORDER.APPROVED' || event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      const orderRef = event.resource?.purchase_units?.[0]?.reference_id;
      if (orderRef) {
        const order = await getOrderByNumber(orderRef);
        if (order) await updatePaymentStatus(order.id, PAYMENT_STATUS.PAID, event.resource?.id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[PayPal] Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
