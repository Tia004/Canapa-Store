import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    name: 'Canapa Store API',
    version: '1.0.0',
    status: 'healthy',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        logout: 'POST /api/auth/logout',
        me: 'GET /api/auth/me',
        refresh: 'POST /api/auth/refresh',
      },
      products: {
        list: 'GET /api/products',
        detail: 'GET /api/products/:slug',
      },
      cart: {
        get: 'GET /api/cart',
        add: 'POST /api/cart',
        update: 'PATCH /api/cart/:itemId',
        remove: 'DELETE /api/cart/:itemId',
      },
      orders: {
        create: 'POST /api/orders',
        status: 'GET /api/orders/:id',
      },
      blog: {
        list: 'GET /api/blog',
        detail: 'GET /api/blog/:slug',
      },
      shipping: {
        rates: 'POST /api/shipping/rates',
        track: 'GET /api/shipping/track/:id',
      },
      payments: {
        vivawallet_create: 'POST /api/payments/vivawallet/create',
        paypal_create: 'POST /api/payments/paypal/create',
        paypal_capture: 'POST /api/payments/paypal/capture',
        nexi_create: 'POST /api/payments/nexi/create',
      },
    },
  });
}
