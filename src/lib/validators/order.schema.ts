import { z } from 'zod';
import { PAYMENT_METHOD } from '@/lib/db/schema';

const orderAddressSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  province: z.string().min(1),
  zipCode: z.string().min(1),
  country: z.string().length(2).default('IT'),
  phone: z.string().optional(),
  email: z.string().email().optional(),
});

export const createOrderSchema = z.object({
  shippingAddress: orderAddressSchema,
  billingAddress: orderAddressSchema.optional(),
  paymentMethod: z.enum([
    PAYMENT_METHOD.VIVAWALLET,
    PAYMENT_METHOD.PAYPAL,
    PAYMENT_METHOD.BANK_TRANSFER,
    PAYMENT_METHOD.CASH_ON_DELIVERY,
  ]),
  shippingMethod: z.string().optional(),
  customerNotes: z.string().max(1000).optional(),
  couponCode: z.string().max(100).optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']),
  adminNotes: z.string().optional(),
  trackingNumber: z.string().optional(),
});

export const orderQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: z.string().optional(),
  paymentStatus: z.string().optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type OrderQueryInput = z.infer<typeof orderQuerySchema>;
