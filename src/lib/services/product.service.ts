import { eq, and, ilike, desc, asc, sql, gte, lte, type SQL } from 'drizzle-orm';
import { db } from '@/lib/db';
import { products, productVariants, categories } from '@/lib/db/schema';
import type { CreateProductInput, UpdateProductInput, CreateVariantInput, ProductQueryInput, CreateCategoryInput } from '@/lib/validators/product.schema';

// ============================================================================
// PRODUCTS
// ============================================================================

/**
 * Get products with filtering, sorting, and pagination
 */
export async function getProducts(query: ProductQueryInput) {
  const { page, limit, category, search, sort, featured, minPrice, maxPrice } = query;
  const offset = (page - 1) * limit;

  const conditions: SQL[] = [eq(products.isActive, true)];

  if (category) {
    const [cat] = await db.select({ id: categories.id }).from(categories).where(eq(categories.slug, category));
    if (cat) conditions.push(eq(products.categoryId, cat.id));
  }

  if (search) {
    conditions.push(ilike(products.name, `%${search}%`));
  }

  if (featured !== undefined) {
    conditions.push(eq(products.isFeatured, featured));
  }

  if (minPrice !== undefined) {
    conditions.push(gte(products.price, String(minPrice)));
  }

  if (maxPrice !== undefined) {
    conditions.push(lte(products.price, String(maxPrice)));
  }

  const whereClause = and(...conditions);

  // Sorting
  const sortMap = {
    price_asc: asc(products.price),
    price_desc: desc(products.price),
    name_asc: asc(products.name),
    name_desc: desc(products.name),
    newest: desc(products.createdAt),
    oldest: asc(products.createdAt),
  };

  const orderBy = sortMap[sort] ?? desc(products.createdAt);

  // Get total count
  const [{ count }] = await db.select({ count: sql<number>`count(*)` })
    .from(products)
    .where(whereClause);

  // Get items
  const items = await db.select()
    .from(products)
    .where(whereClause)
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);

  return {
    items,
    pagination: {
      page,
      limit,
      total: Number(count),
      totalPages: Math.ceil(Number(count) / limit),
    },
  };
}

/**
 * Get a single product by slug (public)
 */
export async function getProductBySlug(slug: string) {
  const [product] = await db.select()
    .from(products)
    .where(and(eq(products.slug, slug), eq(products.isActive, true)));

  if (!product) return null;

  // Get variants if product has them
  let variants = null;
  if (product.hasVariants) {
    variants = await db.select()
      .from(productVariants)
      .where(and(
        eq(productVariants.productId, product.id),
        eq(productVariants.isActive, true),
      ))
      .orderBy(asc(productVariants.sortOrder));
  }

  return { ...product, variants };
}

/**
 * Get product by ID (internal, no active check)
 */
export async function getProductById(id: string) {
  const [product] = await db.select().from(products).where(eq(products.id, id));
  return product ?? null;
}

/**
 * Create a new product (admin)
 */
export async function createProduct(data: CreateProductInput) {
  const [product] = await db.insert(products).values({
    ...data,
    publishedAt: data.isActive ? new Date() : null,
  }).returning();

  return product;
}

/**
 * Update a product (admin)
 */
export async function updateProduct(id: string, data: UpdateProductInput) {
  const [updated] = await db.update(products).set({
    ...data,
    updatedAt: new Date(),
  }).where(eq(products.id, id)).returning();

  return updated ?? null;
}

/**
 * Delete a product (admin) — soft delete by setting isActive to false
 */
export async function deleteProduct(id: string) {
  const [updated] = await db.update(products).set({
    isActive: false,
    updatedAt: new Date(),
  }).where(eq(products.id, id)).returning({ id: products.id });

  return updated ?? null;
}

/**
 * Update product stock
 */
export async function updateProductStock(id: string, quantityChange: number) {
  const [updated] = await db.update(products).set({
    stock: sql`${products.stock} + ${quantityChange}`,
    updatedAt: new Date(),
  }).where(eq(products.id, id)).returning({ id: products.id, stock: products.stock });

  return updated ?? null;
}

// ============================================================================
// PRODUCT VARIANTS
// ============================================================================

/**
 * Create a variant for a product
 */
export async function createVariant(productId: string, data: CreateVariantInput) {
  const [variant] = await db.insert(productVariants).values({
    productId,
    ...data,
  }).returning();

  return variant;
}

/**
 * Get variants for a product
 */
export async function getVariantsByProductId(productId: string) {
  return db.select()
    .from(productVariants)
    .where(eq(productVariants.productId, productId))
    .orderBy(asc(productVariants.sortOrder));
}

/**
 * Update a variant
 */
export async function updateVariant(variantId: string, data: Partial<CreateVariantInput>) {
  const [updated] = await db.update(productVariants).set(data)
    .where(eq(productVariants.id, variantId))
    .returning();

  return updated ?? null;
}

/**
 * Delete a variant
 */
export async function deleteVariant(variantId: string) {
  const [deleted] = await db.delete(productVariants)
    .where(eq(productVariants.id, variantId))
    .returning({ id: productVariants.id });

  return deleted ?? null;
}

// ============================================================================
// CATEGORIES
// ============================================================================

/**
 * Get all categories (tree structure)
 */
export async function getCategories() {
  return db.select()
    .from(categories)
    .where(eq(categories.isActive, true))
    .orderBy(asc(categories.sortOrder));
}

/**
 * Create a category
 */
export async function createCategory(data: CreateCategoryInput) {
  const [category] = await db.insert(categories).values(data).returning();
  return category;
}

/**
 * Update a category
 */
export async function updateCategory(id: string, data: Partial<CreateCategoryInput>) {
  const [updated] = await db.update(categories).set(data)
    .where(eq(categories.id, id))
    .returning();

  return updated ?? null;
}

/**
 * Delete a category (soft)
 */
export async function deleteCategory(id: string) {
  const [updated] = await db.update(categories).set({ isActive: false })
    .where(eq(categories.id, id))
    .returning({ id: categories.id });

  return updated ?? null;
}
