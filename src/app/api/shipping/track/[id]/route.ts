import { NextResponse } from 'next/server';
import { trackShipment } from '@/lib/services/shipping.service';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const tracking = await trackShipment(id);
    if (!tracking) return NextResponse.json({ error: 'Spedizione non trovata' }, { status: 404 });
    return NextResponse.json({ success: true, data: tracking });
  } catch (error) {
    console.error('[Shipping] Track error:', error);
    return NextResponse.json({ error: 'Errore nel tracking' }, { status: 500 });
  }
}
