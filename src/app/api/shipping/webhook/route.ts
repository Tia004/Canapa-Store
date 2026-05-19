import { NextResponse } from 'next/server';
import { updateOrderStatus, getOrderByNumber } from '@/lib/services/order.service';
import { sendDeliveryEmail } from '@/lib/services/email.service';
import { ORDER_STATUS } from '@/lib/db/schema';
import type { OrderAddress } from '@/lib/db/schema';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { parcel_id, status, tracking_number, order_number } = body?.parcel ?? body ?? {};

    if (order_number && status) {
      const order = await getOrderByNumber(order_number);
      if (order) {
        // Map Sendcloud statuses to our statuses
        const statusMap: Record<number, string> = {
          1: ORDER_STATUS.PENDING,      // Announced
          3: ORDER_STATUS.SHIPPED,       // En route to sorting center
          4: ORDER_STATUS.SHIPPED,       // Delivered to sorting center
          5: ORDER_STATUS.SHIPPED,       // Sorted
          6: ORDER_STATUS.SHIPPED,       // Not sorted
          8: ORDER_STATUS.SHIPPED,       // Delivered to carrier
          11: ORDER_STATUS.DELIVERED,    // Delivered
          62: ORDER_STATUS.SHIPPED,      // Being delivered
        };

        const newStatus = statusMap[status?.id ?? status] ?? ORDER_STATUS.SHIPPED;
        await updateOrderStatus(order.id, newStatus);

        // Send delivery email
        if (newStatus === ORDER_STATUS.DELIVERED) {
          const addr = order.shippingAddress as OrderAddress;
          if (addr.email) {
            sendDeliveryEmail(addr.email, order.orderNumber).catch(console.error);
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Sendcloud] Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
