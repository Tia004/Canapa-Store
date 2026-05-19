import type {
  OrderAddress,
  OrderItem,
  ProductImage,
  ProductDimensions,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
} from '@/lib/db/schema';

// Re-export schema types
export type { OrderAddress, OrderItem, ProductImage, ProductDimensions, OrderStatus, PaymentStatus, PaymentMethod };

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================================================
// Auth Types
// ============================================================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
}

// ============================================================================
// Cart Types
// ============================================================================

export interface CartItemWithProduct {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: string;
    salePrice: string | null;
    images: ProductImage[];
    stock: number;
  };
  variant?: {
    id: string;
    name: string;
    price: string;
    salePrice: string | null;
    stock: number;
  } | null;
}

export interface CartSummary {
  items: CartItemWithProduct[];
  itemCount: number;
  subtotal: number;
}

// ============================================================================
// Order Types
// ============================================================================

export interface CreateOrderInput {
  items: { productId: string; variantId?: string; quantity: number }[];
  shippingAddress: OrderAddress;
  billingAddress?: OrderAddress;
  paymentMethod: PaymentMethod;
  shippingMethod?: string;
  customerNotes?: string;
  couponCode?: string;
}

export interface OrderSummary {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  subtotal: string;
  shippingCost: string;
  taxAmount: string;
  discountAmount: string;
  total: string;
  trackingNumber: string | null;
  createdAt: Date;
}

// ============================================================================
// Payment Types
// ============================================================================

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  redirectUrl?: string;
  error?: string;
  metadata?: Record<string, unknown>;
}

export interface VivaWalletOrderResponse {
  orderCode: number;
}

export interface PayPalOrderResponse {
  id: string;
  status: string;
  links: { rel: string; href: string }[];
}

export interface BankTransferDetails {
  iban: string;
  accountHolder: string;
  bankName: string;
  amount: string;
  reference: string; // order number as causale
}

// ============================================================================
// Shipping Types
// ============================================================================

export interface ShippingRate {
  id: string;
  name: string;
  carrier: string;
  price: number;
  estimatedDays: string;
}

export interface ShippingLabel {
  parcelId: string;
  trackingNumber: string;
  labelUrl: string;
  carrier: string;
}

export interface TrackingInfo {
  parcelId: string;
  trackingNumber: string;
  carrier: string;
  status: string;
  events: TrackingEvent[];
}

export interface TrackingEvent {
  timestamp: string;
  description: string;
  location?: string;
}

// ============================================================================
// Blog Types
// ============================================================================

export interface BlogPostSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  authorName: string;
  tags: string[];
  publishedAt: Date | null;
}

export interface BlogPostFull extends BlogPostSummary {
  content: string;
  metaTitle: string | null;
  metaDescription: string | null;
}

// ============================================================================
// Email Types
// ============================================================================

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export type EmailTemplate =
  | 'welcome'
  | 'order_confirmed'
  | 'payment_received'
  | 'order_shipped'
  | 'order_delivered'
  | 'order_cancelled'
  | 'admin_new_order';

// ============================================================================
// Review Types
// ============================================================================

export interface ReviewSummary {
  id: string;
  authorName: string;
  initials: string;
  rating: number;
  text: string;
  productId: string | null;
  productName: string | null;
  isPublished: boolean;
  createdAt: Date;
}

export interface ReviewFull extends ReviewSummary {
  updatedAt: Date;
}

