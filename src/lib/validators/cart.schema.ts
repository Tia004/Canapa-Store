import { z } from 'zod';

export const addToCartSchema = z.object({
  productId: z.string().uuid('ID prodotto non valido'),
  variantId: z.string().uuid().optional(),
  quantity: z.number().int().positive('La quantità deve essere positiva').default(1),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().positive('La quantità deve essere positiva'),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
