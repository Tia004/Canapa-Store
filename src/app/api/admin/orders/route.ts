import { NextResponse } from 'next/server';
import { orderQuerySchema, updateOrderStatusSchema } from '@/lib/validators/order.schema';
import { getOrders } from '@/lib/services/order.service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = orderQuerySchema.parse(Object.fromEntries(searchParams));
    const result = await getOrders(query);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('[Admin] Orders GET error:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}
