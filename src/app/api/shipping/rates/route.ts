import { NextResponse } from 'next/server';
import { calculateShippingRates } from '@/lib/services/shipping.service';

export async function POST(request: Request) {
  try {
    const { weight, country } = await request.json();
    if (!weight || !country) return NextResponse.json({ error: 'Peso e paese richiesti' }, { status: 400 });

    const rates = await calculateShippingRates(weight, country);
    return NextResponse.json({ success: true, data: rates });
  } catch (error) {
    console.error('[Shipping] Rates error:', error);
    return NextResponse.json({ error: 'Errore nel calcolo delle tariffe' }, { status: 500 });
  }
}
