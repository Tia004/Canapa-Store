import { NextResponse } from 'next/server';
import { createPayPalOrder } from '@/lib/payments/paypal';

export async function POST(request: Request) {
  try {
    const { amount, orderNumber, currency } = await request.json();
    if (!amount || !orderNumber) return NextResponse.json({ error: 'Parametri mancanti' }, { status: 400 });

    const result = await createPayPalOrder(amount, orderNumber, currency ?? 'EUR');
    return NextResponse.json({ success: result.success, data: result });
  } catch (error) {
    console.error('[PayPal] Create error:', error);
    return NextResponse.json({ error: 'Errore di pagamento' }, { status: 500 });
  }
}
