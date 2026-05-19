import { NextResponse } from 'next/server';
import { createNexiOrder } from '@/lib/payments/nexi';

export async function POST(request: Request) {
  try {
    const { amount, orderNumber, email, customerName } = await request.json();
    if (!amount || !orderNumber || !email) {
      return NextResponse.json({ error: 'Parametri mancanti' }, { status: 400 });
    }

    const amountCents = Math.round(parseFloat(amount) * 100);
    const result = await createNexiOrder(amountCents, orderNumber, email, customerName);

    return NextResponse.json({ success: result.success, data: result });
  } catch (error) {
    console.error('[Nexi] Create error:', error);
    return NextResponse.json({ error: 'Errore di pagamento' }, { status: 500 });
  }
}
