import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  tablesFilter: ['users', 'user_addresses', 'categories', 'products', 'product_variants', 'cart_items', 'orders', 'order_payments', 'blog_posts', 'coupons', 'reviews'],
});
