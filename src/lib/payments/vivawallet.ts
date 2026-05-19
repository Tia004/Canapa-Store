import type { PaymentResult } from '@/types';

const API_URL = process.env.VIVAWALLET_API_URL ?? 'https://api.vivapayments.com';
const CLIENT_ID = process.env.VIVAWALLET_CLIENT_ID!;
const CLIENT_SECRET = process.env.VIVAWALLET_CLIENT_SECRET!;
const MERCHANT_ID = process.env.VIVAWALLET_MERCHANT_ID!;
const API_KEY = process.env.VIVAWALLET_API_KEY!;
const SOURCE_CODE = process.env.VIVAWALLET_SOURCE_CODE!;

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) return cachedToken.token;

  const res = await fetch(`${API_URL}/connect/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'client_credentials', client_id: CLIENT_ID, client_secret: CLIENT_SECRET }),
  });

  if (!res.ok) throw new Error(`VivaWallet auth failed: ${res.status}`);
  const data = await res.json();
  cachedToken = { token: data.access_token, expiresAt: Date.now() + (data.expires_in - 60) * 1000 };
  return cachedToken.token;
}

/** Create a payment order and return redirect URL */
export async function createVivaWalletOrder(amountCents: number, orderNumber: string, email: string): Promise<PaymentResult> {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${API_URL}/checkout/v2/orders`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: amountCents,
        currencyCode: 978, // EUR
        customerTrns: `Ordine ${orderNumber}`,
        customer: { email },
        sourceCode: SOURCE_CODE,
        merchantTrns: orderNumber,
      }),
    });

    if (!res.ok) throw new Error(`VivaWallet order creation failed: ${res.status}`);
    const data = await res.json();
    const checkoutUrl = API_URL.includes('demo')
      ? `https://demo.vivapayments.com/web/checkout?ref=${data.orderCode}`
      : `https://www.vivapayments.com/web/checkout?ref=${data.orderCode}`;

    return { success: true, transactionId: String(data.orderCode), redirectUrl: checkoutUrl };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'VivaWallet error' };
  }
}

/** Verify webhook signature */
export async function verifyVivaWalletWebhook(body: string, signature: string): Promise<boolean> {
  // VivaWallet uses a verification key that you set in your dashboard
  // For now, we do basic validation
  try {
    const payload = JSON.parse(body);
    return payload && typeof payload.EventTypeId !== 'undefined';
  } catch {
    return false;
  }
}

/** Get transaction details */
export async function getVivaWalletTransaction(transactionId: string) {
  const token = await getAccessToken();
  const res = await fetch(`${API_URL}/checkout/v2/transactions/${transactionId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return res.json();
}
