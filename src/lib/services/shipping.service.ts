import { createParcel, getTrackingInfo, getShippingRates as getSCRates, cancelParcel } from '@/lib/shipping/sendcloud';
import { updateOrderStatus } from './order.service';
import { sendShippingNotificationEmail } from './email.service';
import { ORDER_STATUS } from '@/lib/db/schema';
import type { ShippingRate, ShippingLabel, TrackingInfo } from '@/types';

export async function calculateShippingRates(weight: number, country: string): Promise<ShippingRate[]> {
  return getSCRates(weight, country);
}

export async function createShipment(order: {
  id: string; orderNumber: string; shippingAddress: { firstName: string; lastName: string; address: string; city: string; zipCode: string; country: string; phone?: string; email?: string };
  weight: number; shippingMethodId: number;
}): Promise<ShippingLabel> {
  const label = await createParcel({
    name: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
    address: order.shippingAddress.address,
    city: order.shippingAddress.city,
    postalCode: order.shippingAddress.zipCode,
    country: order.shippingAddress.country,
    email: order.shippingAddress.email ?? '',
    phone: order.shippingAddress.phone ?? '',
    orderNumber: order.orderNumber,
    weight: order.weight,
    shippingMethodId: order.shippingMethodId,
  });

  await updateOrderStatus(order.id, ORDER_STATUS.SHIPPED, undefined, label.trackingNumber);

  if (order.shippingAddress.email) {
    await sendShippingNotificationEmail(order.shippingAddress.email, order.orderNumber, label.trackingNumber, label.carrier);
  }

  return label;
}

export async function trackShipment(parcelId: string): Promise<TrackingInfo | null> {
  return getTrackingInfo(parcelId);
}

export async function cancelShipment(parcelId: string): Promise<boolean> {
  return cancelParcel(parcelId);
}
