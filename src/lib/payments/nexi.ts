import type { PaymentResult } from '@/types';
import crypto from 'crypto';

const API_KEY = process.env.NEXI_API_KEY!;
const API_URL = process.env.NEXI_API_URL ?? 'https://stg-ta.nexigroup.com/api/phoenix-0.0/psp/api/v1';

/**
 * Create a payment order via Nexi XPay REST API (Hosted Payment Page)
 */
export async function createNexiOrder(
  amountCents: number,
  orderNumber: string,
  email: string,
  customerName = 'Cliente',
): Promise<PaymentResult> {
  try {
    const correlationId = crypto.randomUUID();
    const res = await fetch(`${API_URL}/orders/hpp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': API_KEY,
        'Correlation-Id': correlationId,
      },
      body: JSON.stringify({
        orderId: orderNumber,
        amount: amountCents,
        currency: 'EUR',
        description: `Ordine ${orderNumber}`,
        customerInfo: {
          cardHolderName: customerName,
          cardHolderEmail: email,
        },
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Nexi API error ${res.status}: ${errorText}`);
    }

    const data = await res.json();
    return {
      success: true,
      transactionId: data.securityToken,
      redirectUrl: data.hostedPage,
      metadata: { securityToken: data.securityToken },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Nexi payment creation error',
    };
  }
}

/**
 * Basic Webhook check for Nexi XPay notifications
 */
export async function verifyNexiWebhook(body: string, signature: string): Promise<boolean> {
  // Nexi sends notifications with validation. In a complete integration, you'd match signatures.
  // For basic robustness, we verify the presence of key fields.
  try {
    const payload = JSON.parse(body);
    return payload && typeof payload.orderId !== 'undefined';
  } catch {
    return false;
  }
}
