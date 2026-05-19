import { eq, desc, sql, type SQL, and } from 'drizzle-orm';
import { db } from '@/lib/db';
import { reviews, products } from '@/lib/db/schema';
import type { CreateReviewInput, UpdateReviewInput, ReviewQueryInput } from '@/lib/validators/review.schema';
import type { ReviewSummary, ReviewFull } from '@/types';

export async function getAllReviews(query: ReviewQueryInput) {
  const { page, limit, isPublished } = query;
  const offset = (page - 1) * limit;
  
  const conditions: SQL[] = [];
  if (isPublished !== undefined) {
    conditions.push(eq(reviews.isPublished, isPublished));
  }
  
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(reviews)
    .where(whereClause);
    
  const items = await db
    .select({
      id: reviews.id,
      authorName: reviews.authorName,
      initials: reviews.initials,
      rating: reviews.rating,
      text: reviews.text,
      productId: reviews.productId,
      productName: products.name,
      isPublished: reviews.isPublished,
      createdAt: reviews.createdAt,
    })
    .from(reviews)
    .leftJoin(products, eq(reviews.productId, products.id))
    .where(whereClause)
    .orderBy(desc(reviews.createdAt))
    .limit(limit)
    .offset(offset);

  return { 
    items: items as ReviewSummary[], 
    pagination: { 
      page, 
      limit, 
      total: Number(count), 
      totalPages: Math.ceil(Number(count) / limit) 
    } 
  };
}

export async function getPublishedReviews() {
  const items = await db
    .select({
      id: reviews.id,
      authorName: reviews.authorName,
      initials: reviews.initials,
      rating: reviews.rating,
      text: reviews.text,
      productId: reviews.productId,
      productName: products.name,
      isPublished: reviews.isPublished,
      createdAt: reviews.createdAt,
    })
    .from(reviews)
    .leftJoin(products, eq(reviews.productId, products.id))
    .where(eq(reviews.isPublished, true))
    .orderBy(desc(reviews.createdAt));

  return items as ReviewSummary[];
}

export async function getReviewById(id: string) {
  const [review] = await db
    .select({
      id: reviews.id,
      authorName: reviews.authorName,
      initials: reviews.initials,
      rating: reviews.rating,
      text: reviews.text,
      productId: reviews.productId,
      productName: products.name,
      isPublished: reviews.isPublished,
      createdAt: reviews.createdAt,
      updatedAt: reviews.updatedAt,
    })
    .from(reviews)
    .leftJoin(products, eq(reviews.productId, products.id))
    .where(eq(reviews.id, id));
    
  return (review as ReviewFull) ?? null;
}

export async function createReview(data: CreateReviewInput) {
  const [review] = await db.insert(reviews).values({
    ...data,
  }).returning();
  return review;
}

export async function updateReview(id: string, data: UpdateReviewInput) {
  const updates: Record<string, unknown> = { ...data, updatedAt: new Date() };
  
  const [updated] = await db
    .update(reviews)
    .set(updates)
    .where(eq(reviews.id, id))
    .returning();
    
  return updated ?? null;
}

export async function deleteReview(id: string) {
  const [deleted] = await db
    .delete(reviews)
    .where(eq(reviews.id, id))
    .returning({ id: reviews.id });
    
  return deleted ?? null;
}
