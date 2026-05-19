import { sendEmail } from '@/lib/email/client';
import * as templates from '@/lib/email/templates';
import type { OrderItem, OrderAddress, BankTransferDetails } from '@/types';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? '';

export async function sendWelcomeEmail(to: string, firstName: string) {
  const { subject, html } = templates.welcomeEmail(firstName);
  return sendEmail(to, subject, html);
}

export async function sendOrderConfirmationEmail(to: string, orderNumber: string, items: OrderItem[], total: string, address: OrderAddress) {
  const { subject, html } = templates.orderConfirmedEmail(orderNumber, items, total, address);
  return sendEmail(to, subject, html);
}

export async function sendBankTransferDetailsEmail(to: string, orderNumber: string, details: BankTransferDetails) {
  const { subject, html } = templates.bankTransferEmail(orderNumber, details);
  return sendEmail(to, subject, html);
}

export async function sendShippingNotificationEmail(to: string, orderNumber: string, trackingNumber: string, carrier: string) {
  const { subject, html } = templates.shippingEmail(orderNumber, trackingNumber, carrier);
  return sendEmail(to, subject, html);
}

export async function sendDeliveryEmail(to: string, orderNumber: string) {
  const { subject, html } = templates.deliveryEmail(orderNumber);
  return sendEmail(to, subject, html);
}

export async function notifyAdminNewOrder(orderNumber: string, total: string, method: string) {
  if (!ADMIN_EMAIL) return;
  const { subject, html } = templates.adminNewOrderEmail(orderNumber, total, method);
  return sendEmail(ADMIN_EMAIL, subject, html);
}
