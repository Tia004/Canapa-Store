import { NextResponse } from 'next/server';
import { capturePayPalPayment } from '@/lib/payments/paypal';
import { updatePaymentStatus, getOrderByNumber } from '@/lib/services/order.service';
import { PAYMENT_STATUS } from '@/lib/db/schema';

export async function POST(request: Request) {
  try {
    const { paypalOrderId, orderNumber } = await request.json();
    if (!paypalOrderId || !orderNumber) return NextResponse.json({ error: 'Parametri mancanti' }, { status: 400 });

    const result = await capturePayPalPayment(paypalOrderId);
    if (result.success) {
      const order = await getOrderByNumber(orderNumber);
      if (order) await updatePaymentStatus(order.id, PAYMENT_STATUS.PAID, result.transactionId);
    }

    return NextResponse.json({ success: result.success, data: result });
  } catch (error) {
    console.error('[PayPal] Capture error:', error);
    return NextResponse.json({ error: 'Errore nella cattura del pagamento' }, { status: 500 });
  }
}
