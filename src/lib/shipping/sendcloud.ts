import type { ShippingRate, ShippingLabel, TrackingInfo } from '@/types';

const BASE_URL = 'https://panel.sendcloud.sc/api/v2';
const PUBLIC_KEY = process.env.SENDCLOUD_PUBLIC_KEY ?? '';
const PRIVATE_KEY = process.env.SENDCLOUD_PRIVATE_KEY ?? '';

function getAuthHeader(): string {
  return 'Basic ' + Buffer.from(`${PUBLIC_KEY}:${PRIVATE_KEY}`).toString('base64');
}

async function sendcloudFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { Authorization: getAuthHeader(), 'Content-Type': 'application/json', ...options.headers },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Sendcloud API error ${res.status}: ${err}`);
  }
  return res.json();
}

/** Get available shipping methods */
export async function getShippingMethods() {
  const data = await sendcloudFetch('/shipping_methods');
  return data.shipping_methods;
}

/** Calculate shipping rates for a parcel */
export async function getShippingRates(weight: number, country: string): Promise<ShippingRate[]> {
  const methods = await getShippingMethods();
  return methods
    .filter((m: { countries: { iso_2: string }[] }) =>
      m.countries?.some((c: { iso_2: string }) => c.iso_2 === country)
    )
    .map((m: { id: number; name: string; carrier: string; price: number; min_transit_time?: number; max_transit_time?: number }) => ({
      id: String(m.id),
      name: m.name,
      carrier: m.carrier,
      price: m.price ?? 0,
      estimatedDays: m.min_transit_time && m.max_transit_time ? `${m.min_transit_time}-${m.max_transit_time} giorni` : 'N/A',
    }));
}

/** Create a parcel and generate shipping label (BRT) */
export async function createParcel(order: {
  name: string; address: string; city: string; postalCode: string;
  country: string; email: string; phone: string; orderNumber: string;
  weight: number; shippingMethodId: number;
}): Promise<ShippingLabel> {
  const data = await sendcloudFetch('/parcels', {
    method: 'POST',
    body: JSON.stringify({
      parcel: {
        name: order.name,
        address: order.address,
        city: order.city,
        postal_code: order.postalCode,
        country: order.country,
        email: order.email,
        telephone: order.phone,
        order_number: order.orderNumber,
        weight: order.weight / 1000, // grams to kg
        shipment: { id: order.shippingMethodId },
        request_label: true,
      },
    }),
  });

  const parcel = data.parcel;
  return {
    parcelId: String(parcel.id),
    trackingNumber: parcel.tracking_number,
    labelUrl: parcel.label?.label_printer ?? parcel.label?.normal_printer?.[0] ?? '',
    carrier: parcel.carrier?.code ?? 'brt',
  };
}

/** Get tracking info for a parcel */
export async function getTrackingInfo(parcelId: string): Promise<TrackingInfo | null> {
  try {
    const data = await sendcloudFetch(`/parcels/${parcelId}`);
    const parcel = data.parcel;
    return {
      parcelId: String(parcel.id),
      trackingNumber: parcel.tracking_number,
      carrier: parcel.carrier?.code ?? 'brt',
      status: parcel.status?.message ?? 'unknown',
      events: (parcel.statuses ?? []).map((s: { date: string; message: string; location?: string }) => ({
        timestamp: s.date,
        description: s.message,
        location: s.location,
      })),
    };
  } catch {
    return null;
  }
}

/** Cancel a parcel */
export async function cancelParcel(parcelId: string): Promise<boolean> {
  try {
    await sendcloudFetch(`/parcels/${parcelId}/cancel`, { method: 'POST' });
    return true;
  } catch {
    return false;
  }
}
