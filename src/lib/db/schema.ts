import {
  pgTable,
  uuid,
  varchar,
  text,
  decimal,
  integer,
  boolean,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
  type AnyPgColumn,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================================================
// USERS
// ============================================================================

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 30 }),
  // Shipping address
  address: text('address'),
  city: varchar('city', { length: 100 }),
  province: varchar('province', { length: 100 }),
  zipCode: varchar('zip_code', { length: 20 }),
  country: varchar('country', { length: 2 }).default('IT'),
  // Account status
  isVerified: boolean('is_verified').default(false).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  // Metadata
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex('users_email_idx').on(table.email),
]);

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  cartItems: many(cartItems),
  addresses: many(userAddresses),
}));

// ============================================================================
// USER ADDRESSES (multiple shipping/billing addresses)
// ============================================================================

export const userAddresses = pgTable('user_addresses', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  label: varchar('label', { length: 50 }), // e.g. "Casa", "Ufficio"
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  address: text('address').notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  province: varchar('province', { length: 100 }).notNull(),
  zipCode: varchar('zip_code', { length: 20 }).notNull(),
  country: varchar('country', { length: 2 }).default('IT').notNull(),
  phone: varchar('phone', { length: 30 }),
  isDefault: boolean('is_default').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('user_addresses_user_id_idx').on(table.userId),
]);

export const userAddressesRelations = relations(userAddresses, ({ one }) => ({
  user: one(users, {
    fields: [userAddresses.userId],
    references: [users.id],
  }),
}));

// ============================================================================
// CATEGORIES
// ============================================================================

export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  image: text('image'),
  parentId: uuid('parent_id').references((): AnyPgColumn => categories.id, { onDelete: 'set null' }),
  sortOrder: integer('sort_order').default(0).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex('categories_slug_idx').on(table.slug),
  index('categories_parent_id_idx').on(table.parentId),
]);

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: 'parentChild',
  }),
  children: many(categories, { relationName: 'parentChild' }),
  products: many(products),
}));

// ============================================================================
// PRODUCTS
// ============================================================================

export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  shortDescription: text('short_description'),
  // Pricing
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  salePrice: decimal('sale_price', { precision: 10, scale: 2 }),
  costPrice: decimal('cost_price', { precision: 10, scale: 2 }),
  // Inventory
  sku: varchar('sku', { length: 100 }).unique(),
  stock: integer('stock').default(0).notNull(),
  lowStockThreshold: integer('low_stock_threshold').default(5),
  trackInventory: boolean('track_inventory').default(true).notNull(),
  // Categorization
  categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
  tags: jsonb('tags').$type<string[]>().default([]),
  // Media
  images: jsonb('images').$type<ProductImage[]>().default([]),
  // Physical properties (for shipping)
  weight: decimal('weight', { precision: 8, scale: 2 }), // in grams
  dimensions: jsonb('dimensions').$type<ProductDimensions | null>(),
  // SEO
  metaTitle: varchar('meta_title', { length: 255 }),
  metaDescription: text('meta_description'),
  // Variants support
  hasVariants: boolean('has_variants').default(false).notNull(),
  // Status
  isActive: boolean('is_active').default(true).notNull(),
  isFeatured: boolean('is_featured').default(false).notNull(),
  // Metadata (flexible key-value store for CBD %, THC %, etc.)
  metadata: jsonb('metadata').$type<Record<string, string>>().default({}),
  // Timestamps
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex('products_slug_idx').on(table.slug),
  uniqueIndex('products_sku_idx').on(table.sku),
  index('products_category_id_idx').on(table.categoryId),
  index('products_is_active_idx').on(table.isActive),
]);

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  variants: many(productVariants),
  cartItems: many(cartItems),
  reviews: many(reviews),
}));

// ============================================================================
// PRODUCT VARIANTS (weight, size, etc.)
// ============================================================================

export const productVariants = pgTable('product_variants', {
  id: uuid('id').defaultRandom().primaryKey(),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(), // e.g. "5g", "10g", "Indoor"
  sku: varchar('sku', { length: 100 }).unique(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  salePrice: decimal('sale_price', { precision: 10, scale: 2 }),
  stock: integer('stock').default(0).notNull(),
  weight: decimal('weight', { precision: 8, scale: 2 }),
  attributes: jsonb('attributes').$type<Record<string, string>>().default({}),
  isActive: boolean('is_active').default(true).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('product_variants_product_id_idx').on(table.productId),
]);

export const productVariantsRelations = relations(productVariants, ({ one }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
}));

// ============================================================================
// CART ITEMS
// ============================================================================

export const cartItems = pgTable('cart_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  // Session-based for anonymous users, user-based for logged in
  sessionId: varchar('session_id', { length: 255 }),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  variantId: uuid('variant_id').references(() => productVariants.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').notNull().default(1),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('cart_items_session_id_idx').on(table.sessionId),
  index('cart_items_user_id_idx').on(table.userId),
  index('cart_items_product_id_idx').on(table.productId),
]);

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, {
    fields: [cartItems.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [cartItems.variantId],
    references: [productVariants.id],
  }),
}));

// ============================================================================
// ORDERS
// ============================================================================

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderNumber: varchar('order_number', { length: 50 }).notNull().unique(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  // Guest checkout info
  guestEmail: varchar('guest_email', { length: 255 }),
  // Status
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  // Items snapshot (frozen at time of order)
  items: jsonb('items').$type<OrderItem[]>().notNull(),
  // Pricing
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
  shippingCost: decimal('shipping_cost', { precision: 10, scale: 2 }).default('0').notNull(),
  taxAmount: decimal('tax_amount', { precision: 10, scale: 2 }).default('0').notNull(),
  discountAmount: decimal('discount_amount', { precision: 10, scale: 2 }).default('0').notNull(),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  // Payment
  paymentMethod: varchar('payment_method', { length: 50 }).notNull(),
  paymentStatus: varchar('payment_status', { length: 50 }).notNull().default('pending'),
  // Addresses (frozen at time of order)
  shippingAddress: jsonb('shipping_address').$type<OrderAddress>().notNull(),
  billingAddress: jsonb('billing_address').$type<OrderAddress>(),
  // Shipping
  shippingMethod: varchar('shipping_method', { length: 100 }),
  trackingNumber: varchar('tracking_number', { length: 255 }),
  shippingLabelUrl: text('shipping_label_url'),
  sendcloudParcelId: varchar('sendcloud_parcel_id', { length: 100 }),
  shippedAt: timestamp('shipped_at', { withTimezone: true }),
  deliveredAt: timestamp('delivered_at', { withTimezone: true }),
  // Coupon
  couponCode: varchar('coupon_code', { length: 100 }),
  // Notes
  customerNotes: text('customer_notes'),
  adminNotes: text('admin_notes'),
  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex('orders_order_number_idx').on(table.orderNumber),
  index('orders_user_id_idx').on(table.userId),
  index('orders_status_idx').on(table.status),
  index('orders_payment_status_idx').on(table.paymentStatus),
  index('orders_created_at_idx').on(table.createdAt),
]);

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  payments: many(orderPayments),
}));

// ============================================================================
// ORDER PAYMENTS (payment transaction log)
// ============================================================================

export const orderPayments = pgTable('order_payments', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  method: varchar('method', { length: 50 }).notNull(), // vivawallet, paypal, bank_transfer, cod
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  transactionId: varchar('transaction_id', { length: 255 }),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 3 }).default('EUR').notNull(),
  // Raw response from payment gateway
  gatewayResponse: jsonb('gateway_response'),
  // For bank transfers
  bankReference: varchar('bank_reference', { length: 255 }),
  // Timestamps
  paidAt: timestamp('paid_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('order_payments_order_id_idx').on(table.orderId),
  index('order_payments_transaction_id_idx').on(table.transactionId),
]);

export const orderPaymentsRelations = relations(orderPayments, ({ one }) => ({
  order: one(orders, {
    fields: [orderPayments.orderId],
    references: [orders.id],
  }),
}));

// ============================================================================
// BLOG POSTS
// ============================================================================

export const blogPosts = pgTable('blog_posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  coverImage: text('cover_image'),
  // Author (admin only, stored as name string since no admin table)
  authorName: varchar('author_name', { length: 100 }).notNull(),
  // Categorization
  tags: jsonb('tags').$type<string[]>().default([]),
  // SEO
  metaTitle: varchar('meta_title', { length: 255 }),
  metaDescription: text('meta_description'),
  // Status
  isPublished: boolean('is_published').default(false).notNull(),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex('blog_posts_slug_idx').on(table.slug),
  index('blog_posts_is_published_idx').on(table.isPublished),
  index('blog_posts_published_at_idx').on(table.publishedAt),
]);

// ============================================================================
// COUPONS
// ============================================================================

export const coupons = pgTable('coupons', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: varchar('code', { length: 100 }).notNull().unique(),
  description: text('description'),
  // Discount type
  discountType: varchar('discount_type', { length: 20 }).notNull(), // 'percentage' | 'fixed'
  discountValue: decimal('discount_value', { precision: 10, scale: 2 }).notNull(),
  // Constraints
  minimumOrderAmount: decimal('minimum_order_amount', { precision: 10, scale: 2 }),
  maximumDiscount: decimal('maximum_discount', { precision: 10, scale: 2 }),
  usageLimit: integer('usage_limit'),
  usageCount: integer('usage_count').default(0).notNull(),
  perUserLimit: integer('per_user_limit').default(1),
  // Validity
  startsAt: timestamp('starts_at', { withTimezone: true }),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  isActive: boolean('is_active').default(true).notNull(),
  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex('coupons_code_idx').on(table.code),
]);

// ============================================================================
// TYPE DEFINITIONS (used in JSONB columns)
// ============================================================================

export interface ProductImage {
  url: string;
  alt: string;
  sortOrder: number;
}

export interface ProductDimensions {
  length: number; // cm
  width: number;  // cm
  height: number; // cm
}

export interface OrderItem {
  productId: string;
  variantId?: string;
  name: string;
  sku: string;
  price: string;
  quantity: number;
  total: string;
  image?: string;
}

export interface OrderAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  province: string;
  zipCode: string;
  country: string;
  phone?: string;
  email?: string;
}

// ============================================================================
// ENUM-LIKE CONSTANTS
// ============================================================================

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  COD_PENDING: 'cod_pending',
} as const;

export const PAYMENT_METHOD = {
  VIVAWALLET: 'vivawallet',
  PAYPAL: 'paypal',
  NEXI: 'nexi',
  BANK_TRANSFER: 'bank_transfer',
  CASH_ON_DELIVERY: 'cash_on_delivery',
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];
export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];
export type PaymentMethod = typeof PAYMENT_METHOD[keyof typeof PAYMENT_METHOD];

// ============================================================================
// REVIEWS
// ============================================================================

export const reviews = pgTable('reviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  authorName: varchar('author_name', { length: 100 }).notNull(),
  initials: varchar('initials', { length: 10 }).notNull(),
  rating: integer('rating').notNull(),
  text: text('text').notNull(),
  // Optional linkage to specific product
  productId: uuid('product_id').references(() => products.id, { onDelete: 'set null' }),
  // Published controls visibility
  isPublished: boolean('is_published').default(false).notNull(),
  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('reviews_product_id_idx').on(table.productId),
  index('reviews_is_published_idx').on(table.isPublished),
  index('reviews_rating_idx').on(table.rating),
  index('reviews_created_at_idx').on(table.createdAt),
]);

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
}));

