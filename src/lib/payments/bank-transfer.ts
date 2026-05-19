import type { BankTransferDetails } from '@/types';

const IBAN = process.env.BANK_IBAN ?? '';
const ACCOUNT_HOLDER = process.env.BANK_ACCOUNT_HOLDER ?? '';
const BANK_NAME = process.env.BANK_NAME ?? '';

/** Generate bank transfer details for the customer */
export function generateBankTransferDetails(orderNumber: string, amount: string): BankTransferDetails {
  return {
    iban: IBAN,
    accountHolder: ACCOUNT_HOLDER,
    bankName: BANK_NAME,
    amount,
    reference: orderNumber, // Causale = order number
  };
}

/** Validate bank transfer reference format */
export function isValidTransferReference(reference: string): boolean {
  return /^CS-\d{6}-[A-Z0-9]{6}$/.test(reference);
}
