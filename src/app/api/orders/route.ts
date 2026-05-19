import { NextResponse } from 'next/server';
import { createOrderSchema } from '@/lib/validators/order.schema';
import { createOrder } from '@/lib/services/order.service';
import { initiatePayment } from '@/lib/services/payment.service';
import { sendOrderConfirmationEmail, sendBankTransferDetailsEmail, notifyAdminNewOrder } from '@/lib/services/email.service';
import { generateBankTransferDetails } from '@/lib/payments/bank-transfer';
import { getCartSession } from '@/lib/auth/cookies';
import { authenticateRequest } from '@/lib/auth/middleware';
import { PAYMENT_METHOD } from '@/lib/db/schema';
import type { OrderItem, OrderAddress } from '@/lib/db/schema';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Dati non validi', details: parsed.error.flatten() }, { status: 400 });

    const user = await authenticateRequest();
    const sessionId = user ? undefined : await getCartSession();
    if (!user && !sessionId) return NextResponse.json({ error: 'Carrello non trovato' }, { status: 400 });

    const order = await createOrder(parsed.data, sessionId, user?.sub);

    // Initiate payment
    const email = user?.email ?? parsed.data.shippingAddress.email ?? '';
    const payment = await initiatePayment(parsed.data.paymentMethod, order.orderNumber, order.total, email, parsed.data.shippingAddress.country);

    // Send emails (fire and forget)
    const orderEmail = email;
    if (orderEmail) {
      sendOrderConfirmationEmail(orderEmail, order.orderNumber, order.items as OrderItem[], order.total, order.shippingAddress as OrderAddress).catch(console.error);

      if (parsed.data.paymentMethod === PAYMENT_METHOD.BANK_TRANSFER) {
        const bankDetails = generateBankTransferDetails(order.orderNumber, order.total);
        sendBankTransferDetailsEmail(orderEmail, order.orderNumber, bankDetails).catch(console.error);
      }
    }
    notifyAdminNewOrder(order.orderNumber, order.total, order.paymentMethod).catch(console.error);

    return NextResponse.json({ success: true, data: { order: { id: order.id, orderNumber: order.orderNumber, total: order.total, status: order.status }, payment } }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Errore interno del server';
    console.error('[Orders] POST error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
