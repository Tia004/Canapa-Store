import { eq, and, desc, sql, gte, lte, type SQL } from 'drizzle-orm';
import { db } from '@/lib/db';
import { orders, orderPayments, products, productVariants, ORDER_STATUS, PAYMENT_STATUS, PAYMENT_METHOD } from '@/lib/db/schema';
import type { OrderItem, OrderAddress } from '@/lib/db/schema';
import type { CreateOrderInput, OrderQueryInput } from '@/lib/validators/order.schema';
import { getCart, clearCart } from './cart.service';

function generateOrderNumber(): string {
  const date = new Date();
  const y = date.getFullYear().toString().slice(-2);
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `CS-${y}${m}${d}-${rand}`;
}

export async function createOrder(input: CreateOrderInput, sessionId?: string, userId?: string) {
  const cart = await getCart(sessionId, userId);
  if (cart.items.length === 0) throw new Error('Il carrello è vuoto');

  const orderItems: OrderItem[] = cart.items.map(item => ({
    productId: item.product.id,
    variantId: item.variant?.id,
    name: item.product.name + (item.variant ? ` - ${item.variant.name}` : ''),
    sku: item.product.slug,
    price: item.variant?.salePrice ?? item.variant?.price ?? item.product.salePrice ?? item.product.price,
    quantity: item.quantity,
    total: String(parseFloat(item.variant?.salePrice ?? item.variant?.price ?? item.product.salePrice ?? item.product.price) * item.quantity),
    image: item.product.images?.[0]?.url,
  }));

  let shippingCost = 0;
  const codSurcharge = input.paymentMethod === PAYMENT_METHOD.CASH_ON_DELIVERY ? parseFloat(process.env.COD_SURCHARGE ?? '3') : 0;
  const total = cart.subtotal + shippingCost + codSurcharge;

  const paymentStatus = input.paymentMethod === PAYMENT_METHOD.BANK_TRANSFER ? PAYMENT_STATUS.PENDING
    : input.paymentMethod === PAYMENT_METHOD.CASH_ON_DELIVERY ? PAYMENT_STATUS.COD_PENDING
    : PAYMENT_STATUS.PENDING;

  const [order] = await db.insert(orders).values({
    orderNumber: generateOrderNumber(),
    userId: userId ?? null,
    guestEmail: input.shippingAddress.email ?? null,
    status: ORDER_STATUS.PENDING,
    items: orderItems,
    subtotal: String(cart.subtotal),
    shippingCost: String(shippingCost),
    taxAmount: '0',
    discountAmount: String(codSurcharge > 0 ? 0 : 0),
    total: String(total),
    paymentMethod: input.paymentMethod,
    paymentStatus,
    shippingAddress: input.shippingAddress,
    billingAddress: input.billingAddress ?? input.shippingAddress,
    shippingMethod: input.shippingMethod ?? null,
    couponCode: input.couponCode ?? null,
    customerNotes: input.customerNotes ?? null,
  }).returning();

  // Decrement stock
  for (const item of cart.items) {
    if (item.variant) {
      await db.update(productVariants).set({ stock: sql`${productVariants.stock} - ${item.quantity}` }).where(eq(productVariants.id, item.variant.id));
    } else {
      await db.update(products).set({ stock: sql`${products.stock} - ${item.quantity}` }).where(eq(products.id, item.product.id));
    }
  }

  await clearCart(sessionId, userId);
  return order;
}

export async function getOrderById(orderId: string) {
  const [order] = await db.select().from(orders).where(eq(orders.id, orderId));
  return order ?? null;
}

export async function getOrderByNumber(orderNumber: string) {
  const [order] = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber));
  return order ?? null;
}

export async function getUserOrders(userId: string) {
  return db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
}

export async function getOrders(query: OrderQueryInput) {
  const { page, limit, status, paymentStatus: ps, from, to } = query;
  const offset = (page - 1) * limit;
  const conditions: SQL[] = [];
  if (status) conditions.push(eq(orders.status, status));
  if (ps) conditions.push(eq(orders.paymentStatus, ps));
  if (from) conditions.push(gte(orders.createdAt, new Date(from)));
  if (to) conditions.push(lte(orders.createdAt, new Date(to)));
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(orders).where(whereClause);
  const items = await db.select().from(orders).where(whereClause).orderBy(desc(orders.createdAt)).limit(limit).offset(offset);

  return { items, pagination: { page, limit, total: Number(count), totalPages: Math.ceil(Number(count) / limit) } };
}

export async function updateOrderStatus(orderId: string, status: string, adminNotes?: string, trackingNumber?: string) {
  const updates: Record<string, unknown> = { status, updatedAt: new Date() };
  if (adminNotes) updates.adminNotes = adminNotes;
  if (trackingNumber) updates.trackingNumber = trackingNumber;
  if (status === ORDER_STATUS.SHIPPED) updates.shippedAt = new Date();
  if (status === ORDER_STATUS.DELIVERED) updates.deliveredAt = new Date();

  const [updated] = await db.update(orders).set(updates).where(eq(orders.id, orderId)).returning();
  return updated ?? null;
}

export async function updatePaymentStatus(orderId: string, paymentStatus: string, transactionId?: string) {
  const [updated] = await db.update(orders).set({ paymentStatus, updatedAt: new Date() }).where(eq(orders.id, orderId)).returning();

  if (transactionId) {
    await db.insert(orderPayments).values({
      orderId,
      method: (await getOrderById(orderId))?.paymentMethod ?? 'unknown',
      status: paymentStatus,
      transactionId,
      amount: (await getOrderById(orderId))?.total ?? '0',
      paidAt: paymentStatus === PAYMENT_STATUS.PAID ? new Date() : null,
    });
  }

  return updated ?? null;
}
