import type { PaymentResult } from '@/types';

const API_URL = process.env.PAYPAL_API_URL ?? 'https://api-m.paypal.com';
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID!;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!;

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) return cachedToken.token;

  const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const res = await fetch(`${API_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: { Authorization: `Basic ${credentials}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) throw new Error(`PayPal auth failed: ${res.status}`);
  const data = await res.json();
  cachedToken = { token: data.access_token, expiresAt: Date.now() + (data.expires_in - 60) * 1000 };
  return cachedToken.token;
}

/** Create a PayPal order */
export async function createPayPalOrder(amount: string, orderNumber: string, currency = 'EUR'): Promise<PaymentResult> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${API_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{ reference_id: orderNumber, amount: { currency_code: currency, value: amount }, description: `Ordine ${orderNumber}` }],
      }),
    });

    if (!res.ok) throw new Error(`PayPal order creation failed: ${res.status}`);
    const data = await res.json();
    const approveLink = data.links?.find((l: { rel: string }) => l.rel === 'approve')?.href;

    return { success: true, transactionId: data.id, redirectUrl: approveLink, metadata: { paypalOrderId: data.id } };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'PayPal error' };
  }
}

/** Capture a PayPal payment after customer approval */
export async function capturePayPalPayment(paypalOrderId: string): Promise<PaymentResult> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${API_URL}/v2/checkout/orders/${paypalOrderId}/capture`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });

    if (!res.ok) throw new Error(`PayPal capture failed: ${res.status}`);
    const data = await res.json();
    const captureId = data.purchase_units?.[0]?.payments?.captures?.[0]?.id;

    return { success: data.status === 'COMPLETED', transactionId: captureId ?? paypalOrderId, metadata: data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'PayPal capture error' };
  }
}

/** Verify PayPal webhook (basic) */
export async function verifyPayPalWebhook(headers: Record<string, string>, body: string): Promise<boolean> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${API_URL}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth_algo: headers['paypal-auth-algo'], cert_url: headers['paypal-cert-url'],
        transmission_id: headers['paypal-transmission-id'], transmission_sig: headers['paypal-transmission-sig'],
        transmission_time: headers['paypal-transmission-time'],
        webhook_id: process.env.PAYPAL_WEBHOOK_ID, webhook_event: JSON.parse(body),
      }),
    });
    const data = await res.json();
    return data.verification_status === 'SUCCESS';
  } catch {
    return false;
  }
}
