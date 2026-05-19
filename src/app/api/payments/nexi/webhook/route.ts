import { NextResponse } from 'next/server';
import { getOrderByNumber, updatePaymentStatus } from '@/lib/services/order.service';
import { PAYMENT_STATUS } from '@/lib/db/schema';
import { verifyNexiWebhook } from '@/lib/payments/nexi';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('signature') || '';

    const isValid = await verifyNexiWebhook(rawBody, signature);
    if (!isValid) {
      return NextResponse.json({ error: 'Signature verification failed' }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    // Supponiamo che Nexi ritorni l'orderId (che è il nostro orderNumber) e lo stato del pagamento
    const orderNumber = payload.orderId;
    const paymentStatus = payload.status; // Ad esempio "PAID" o "CAPTURED" o "SUCCESS"

    if (orderNumber && (paymentStatus === 'PAID' || paymentStatus === 'CAPTURED' || paymentStatus === 'SUCCESS')) {
      const order = await getOrderByNumber(orderNumber);
      if (order && order.paymentStatus !== PAYMENT_STATUS.PAID) {
        // Aggiorna lo stato del pagamento e registra la transazione
        await updatePaymentStatus(order.id, PAYMENT_STATUS.PAID, payload.securityToken || payload.transactionId);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Nexi Webhook] Error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
