import { z } from 'zod';

const productImageSchema = z.object({
  url: z.string().url(),
  alt: z.string(),
  sortOrder: z.number().int().min(0).default(0),
});

const productDimensionsSchema = z.object({
  length: z.number().positive(),
  width: z.number().positive(),
  height: z.number().positive(),
});

export const createProductSchema = z.object({
  name: z.string().min(1, 'Nome prodotto richiesto').max(255),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug non valido'),
  description: z.string().optional(),
  shortDescription: z.string().optional(),
  price: z.string().regex(/^\d+\.?\d{0,2}$/, 'Prezzo non valido'),
  salePrice: z.string().regex(/^\d+\.?\d{0,2}$/).optional().nullable(),
  costPrice: z.string().regex(/^\d+\.?\d{0,2}$/).optional().nullable(),
  sku: z.string().max(100).optional().nullable(),
  stock: z.number().int().min(0).default(0),
  lowStockThreshold: z.number().int().min(0).default(5),
  trackInventory: z.boolean().default(true),
  categoryId: z.string().uuid().optional().nullable(),
  tags: z.array(z.string()).default([]),
  images: z.array(productImageSchema).default([]),
  weight: z.string().regex(/^\d+\.?\d{0,2}$/).optional().nullable(),
  dimensions: productDimensionsSchema.optional().nullable(),
  metaTitle: z.string().max(255).optional(),
  metaDescription: z.string().optional(),
  hasVariants: z.boolean().default(false),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  metadata: z.record(z.string(), z.string()).default({}),
});

export const updateProductSchema = createProductSchema.partial();

export const createVariantSchema = z.object({
  name: z.string().min(1).max(255),
  sku: z.string().max(100).optional().nullable(),
  price: z.string().regex(/^\d+\.?\d{0,2}$/),
  salePrice: z.string().regex(/^\d+\.?\d{0,2}$/).optional().nullable(),
  stock: z.number().int().min(0).default(0),
  weight: z.string().regex(/^\d+\.?\d{0,2}$/).optional().nullable(),
  attributes: z.record(z.string(), z.string()).default({}),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().min(0).default(0),
});

export const productQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  category: z.string().optional(),
  search: z.string().optional(),
  sort: z.enum(['price_asc', 'price_desc', 'name_asc', 'name_desc', 'newest', 'oldest']).default('newest'),
  featured: z.coerce.boolean().optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),
});

export const createCategorySchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().optional(),
  image: z.string().url().optional(),
  parentId: z.string().uuid().optional().nullable(),
  sortOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type CreateVariantInput = z.infer<typeof createVariantSchema>;
export type ProductQueryInput = z.infer<typeof productQuerySchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
