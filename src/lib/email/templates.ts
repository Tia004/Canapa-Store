import type { OrderItem, OrderAddress, BankTransferDetails } from '@/types';

const APP_NAME = 'Canapa Store';

function layout(content: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f5f5f5"><div style="max-width:600px;margin:0 auto;background:#fff;padding:32px">${content}<hr style="border:none;border-top:1px solid #eee;margin:24px 0"><p style="color:#999;font-size:12px;text-align:center">&copy; ${new Date().getFullYear()} ${APP_NAME}. Tutti i diritti riservati.</p></div></body></html>`;
}

export function welcomeEmail(firstName: string): { subject: string; html: string } {
  return {
    subject: `Benvenuto su ${APP_NAME}!`,
    html: layout(`<h1 style="color:#2d5016">Benvenuto, ${firstName}!</h1><p>Grazie per esserti registrato su ${APP_NAME}. Siamo felici di averti con noi.</p><p>Inizia a esplorare i nostri prodotti e scopri la qualità della canapa italiana.</p>`),
  };
}

export function orderConfirmedEmail(orderNumber: string, items: OrderItem[], total: string, address: OrderAddress): { subject: string; html: string } {
  const itemsHtml = items.map(i => `<tr><td style="padding:8px;border-bottom:1px solid #eee">${i.name}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">€${i.total}</td></tr>`).join('');
  return {
    subject: `Ordine ${orderNumber} confermato`,
    html: layout(`<h1 style="color:#2d5016">Ordine Confermato</h1><p>Il tuo ordine <strong>${orderNumber}</strong> è stato confermato.</p><table style="width:100%;border-collapse:collapse"><thead><tr><th style="padding:8px;text-align:left;border-bottom:2px solid #2d5016">Prodotto</th><th style="padding:8px;text-align:center;border-bottom:2px solid #2d5016">Qtà</th><th style="padding:8px;text-align:right;border-bottom:2px solid #2d5016">Totale</th></tr></thead><tbody>${itemsHtml}</tbody></table><p style="font-size:18px;text-align:right;margin-top:16px"><strong>Totale: €${total}</strong></p><h3>Indirizzo di spedizione</h3><p>${address.firstName} ${address.lastName}<br>${address.address}<br>${address.zipCode} ${address.city} (${address.province})</p>`),
  };
}

export function bankTransferEmail(orderNumber: string, details: BankTransferDetails): { subject: string; html: string } {
  return {
    subject: `Ordine ${orderNumber} — Dettagli Bonifico`,
    html: layout(`<h1 style="color:#2d5016">Dettagli Bonifico Bancario</h1><p>Per completare l'ordine <strong>${orderNumber}</strong>, effettua un bonifico con i seguenti dati:</p><table style="width:100%;border-collapse:collapse"><tr><td style="padding:8px;font-weight:bold">IBAN</td><td style="padding:8px">${details.iban}</td></tr><tr><td style="padding:8px;font-weight:bold">Intestatario</td><td style="padding:8px">${details.accountHolder}</td></tr><tr><td style="padding:8px;font-weight:bold">Banca</td><td style="padding:8px">${details.bankName}</td></tr><tr><td style="padding:8px;font-weight:bold">Importo</td><td style="padding:8px">€${details.amount}</td></tr><tr><td style="padding:8px;font-weight:bold">Causale</td><td style="padding:8px">${details.reference}</td></tr></table><p><strong>Importante:</strong> Inserisci il numero d'ordine come causale del bonifico.</p>`),
  };
}

export function shippingEmail(orderNumber: string, trackingNumber: string, carrier: string): { subject: string; html: string } {
  return {
    subject: `Ordine ${orderNumber} spedito!`,
    html: layout(`<h1 style="color:#2d5016">Il tuo ordine è stato spedito!</h1><p>L'ordine <strong>${orderNumber}</strong> è stato affidato al corriere.</p><p><strong>Corriere:</strong> ${carrier}<br><strong>Tracking:</strong> ${trackingNumber}</p>`),
  };
}

export function deliveryEmail(orderNumber: string): { subject: string; html: string } {
  return {
    subject: `Ordine ${orderNumber} consegnato`,
    html: layout(`<h1 style="color:#2d5016">Ordine Consegnato!</h1><p>L'ordine <strong>${orderNumber}</strong> è stato consegnato con successo.</p><p>Grazie per aver scelto ${APP_NAME}!</p>`),
  };
}

export function adminNewOrderEmail(orderNumber: string, total: string, method: string): { subject: string; html: string } {
  return {
    subject: `[ADMIN] Nuovo ordine ${orderNumber}`,
    html: layout(`<h1>Nuovo Ordine Ricevuto</h1><p><strong>Ordine:</strong> ${orderNumber}<br><strong>Totale:</strong> €${total}<br><strong>Metodo:</strong> ${method}</p>`),
  };
}
