import { PAYMENT_METHOD } from '@/lib/db/schema';
import type { PaymentResult } from '@/types';
import { createVivaWalletOrder } from '@/lib/payments/vivawallet';
import { createPayPalOrder } from '@/lib/payments/paypal';
import { createNexiOrder } from '@/lib/payments/nexi';
import { generateBankTransferDetails } from '@/lib/payments/bank-transfer';
import { getTotalWithCOD, isCODAvailable } from '@/lib/payments/cash-on-delivery';

/**
 * Orchestrate payment creation based on the selected method.
 * Returns a PaymentResult with redirect URL or payment details.
 */
export async function initiatePayment(
  method: string,
  orderNumber: string,
  amount: string,
  email: string,
  country: string,
): Promise<PaymentResult> {
  switch (method) {
    case PAYMENT_METHOD.VIVAWALLET: {
      const amountCents = Math.round(parseFloat(amount) * 100);
      return createVivaWalletOrder(amountCents, orderNumber, email);
    }

    case PAYMENT_METHOD.PAYPAL: {
      return createPayPalOrder(amount, orderNumber);
    }

    case PAYMENT_METHOD.NEXI: {
      const amountCents = Math.round(parseFloat(amount) * 100);
      return createNexiOrder(amountCents, orderNumber, email);
    }

    case PAYMENT_METHOD.BANK_TRANSFER: {
      const details = generateBankTransferDetails(orderNumber, amount);
      return {
        success: true,
        metadata: { bankTransferDetails: details },
      };
    }

    case PAYMENT_METHOD.CASH_ON_DELIVERY: {
      if (!isCODAvailable(country)) {
        return { success: false, error: 'Il pagamento in contrassegno è disponibile solo in Italia' };
      }
      return {
        success: true,
        metadata: {
          codTotal: getTotalWithCOD(parseFloat(amount)),
          message: 'Pagamento alla consegna confermato',
        },
      };
    }

    default:
      return { success: false, error: 'Metodo di pagamento non supportato' };
  }
}
