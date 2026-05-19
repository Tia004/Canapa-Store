import { eq, and, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { cartItems, products, productVariants } from '@/lib/db/schema';
import type { AddToCartInput } from '@/lib/validators/cart.schema';
import type { CartItemWithProduct, CartSummary } from '@/types';

export async function getCart(sessionId?: string, userId?: string): Promise<CartSummary> {
  if (!sessionId && !userId) return { items: [], itemCount: 0, subtotal: 0 };
  const cond = userId ? eq(cartItems.userId, userId) : eq(cartItems.sessionId, sessionId!);
  const rawItems = await db.select({
    id: cartItems.id, quantity: cartItems.quantity, variantId: cartItems.variantId,
    product: { id: products.id, name: products.name, slug: products.slug, price: products.price, salePrice: products.salePrice, images: products.images, stock: products.stock },
  }).from(cartItems).innerJoin(products, eq(cartItems.productId, products.id)).where(and(cond, eq(products.isActive, true)));

  const items: CartItemWithProduct[] = [];
  let subtotal = 0;
  for (const item of rawItems) {
    let variant = null;
    if (item.variantId) {
      const [v] = await db.select({ id: productVariants.id, name: productVariants.name, price: productVariants.price, salePrice: productVariants.salePrice, stock: productVariants.stock }).from(productVariants).where(eq(productVariants.id, item.variantId));
      variant = v ?? null;
    }
    const price = variant ? parseFloat(variant.salePrice ?? variant.price) : parseFloat(item.product.salePrice ?? item.product.price);
    subtotal += price * item.quantity;
    items.push({ id: item.id, quantity: item.quantity, product: { ...item.product, images: item.product.images ?? [] }, variant });
  }
  return { items, itemCount: items.reduce((s, i) => s + i.quantity, 0), subtotal: Math.round(subtotal * 100) / 100 };
}

export async function addToCart(data: AddToCartInput, sessionId?: string, userId?: string) {
  const conds = [eq(cartItems.productId, data.productId)];
  if (userId) conds.push(eq(cartItems.userId, userId));
  else if (sessionId) conds.push(eq(cartItems.sessionId, sessionId));
  if (data.variantId) conds.push(eq(cartItems.variantId, data.variantId));
  const [existing] = await db.select().from(cartItems).where(and(...conds));
  if (existing) {
    const [updated] = await db.update(cartItems).set({ quantity: existing.quantity + data.quantity, updatedAt: new Date() }).where(eq(cartItems.id, existing.id)).returning();
    return updated;
  }
  const [item] = await db.insert(cartItems).values({ sessionId: userId ? null : sessionId, userId: userId ?? null, productId: data.productId, variantId: data.variantId ?? null, quantity: data.quantity }).returning();
  return item;
}

export async function updateCartItem(itemId: string, quantity: number, sessionId?: string, userId?: string) {
  const conds = [eq(cartItems.id, itemId)];
  if (userId) conds.push(eq(cartItems.userId, userId));
  else if (sessionId) conds.push(eq(cartItems.sessionId, sessionId));
  const [updated] = await db.update(cartItems).set({ quantity, updatedAt: new Date() }).where(and(...conds)).returning();
  return updated ?? null;
}

export async function removeCartItem(itemId: string, sessionId?: string, userId?: string) {
  const conds = [eq(cartItems.id, itemId)];
  if (userId) conds.push(eq(cartItems.userId, userId));
  else if (sessionId) conds.push(eq(cartItems.sessionId, sessionId));
  const [deleted] = await db.delete(cartItems).where(and(...conds)).returning({ id: cartItems.id });
  return deleted ?? null;
}

export async function clearCart(sessionId?: string, userId?: string) {
  if (userId) await db.delete(cartItems).where(eq(cartItems.userId, userId));
  else if (sessionId) await db.delete(cartItems).where(eq(cartItems.sessionId, sessionId));
}

export async function mergeCart(sessionId: string, userId: string) {
  const anonItems = await db.select().from(cartItems).where(eq(cartItems.sessionId, sessionId));
  for (const item of anonItems) {
    const conds = [eq(cartItems.userId, userId), eq(cartItems.productId, item.productId)];
    if (item.variantId) conds.push(eq(cartItems.variantId, item.variantId));
    const [existing] = await db.select().from(cartItems).where(and(...conds));
    if (existing) {
      await db.update(cartItems).set({ quantity: existing.quantity + item.quantity, updatedAt: new Date() }).where(eq(cartItems.id, existing.id));
    } else {
      await db.update(cartItems).set({ userId, sessionId: null, updatedAt: new Date() }).where(eq(cartItems.id, item.id));
    }
  }
  await db.delete(cartItems).where(eq(cartItems.sessionId, sessionId));
}
