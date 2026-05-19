const COD_SURCHARGE = parseFloat(process.env.COD_SURCHARGE ?? '3.00');

/** Calculate the cash on delivery surcharge */
export function calculateCODSurcharge(orderTotal: number): number {
  return COD_SURCHARGE;
}

/** Get total with COD surcharge */
export function getTotalWithCOD(orderTotal: number): number {
  return Math.round((orderTotal + COD_SURCHARGE) * 100) / 100;
}

/** Check if COD is available for the given address */
export function isCODAvailable(country: string): boolean {
  // Cash on delivery only available in Italy
  return country === 'IT';
}
