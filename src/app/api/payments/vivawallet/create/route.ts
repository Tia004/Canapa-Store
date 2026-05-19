import { NextResponse } from 'next/server';
import { createVivaWalletOrder } from '@/lib/payments/vivawallet';

export async function POST(request: Request) {
  try {
    const { orderId, amount, orderNumber, email } = await request.json();
    if (!orderId || !amount || !orderNumber) return NextResponse.json({ error: 'Parametri mancanti' }, { status: 400 });

    const amountCents = Math.round(parseFloat(amount) * 100);
    const result = await createVivaWalletOrder(amountCents, orderNumber, email ?? '');
    return NextResponse.json({ success: result.success, data: result });
  } catch (error) {
    console.error('[VivaWallet] Create error:', error);
    return NextResponse.json({ error: 'Errore di pagamento' }, { status: 500 });
  }
}
