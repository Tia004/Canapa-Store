import { eq, and, desc, ilike, sql, type SQL } from 'drizzle-orm';
import { db } from '@/lib/db';
import { blogPosts } from '@/lib/db/schema';
import type { CreateBlogPostInput, UpdateBlogPostInput, BlogQueryInput } from '@/lib/validators/blog.schema';

export async function getPublishedPosts(query: BlogQueryInput) {
  const { page, limit, tag, search } = query;
  const offset = (page - 1) * limit;
  const conditions: SQL[] = [eq(blogPosts.isPublished, true)];
  if (search) conditions.push(ilike(blogPosts.title, `%${search}%`));
  // Tag filtering done in-memory since tags is JSONB array
  const whereClause = and(...conditions);

  const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(blogPosts).where(whereClause);
  let items = await db.select({
    id: blogPosts.id, title: blogPosts.title, slug: blogPosts.slug, excerpt: blogPosts.excerpt,
    coverImage: blogPosts.coverImage, authorName: blogPosts.authorName, tags: blogPosts.tags,
    publishedAt: blogPosts.publishedAt,
  }).from(blogPosts).where(whereClause).orderBy(desc(blogPosts.publishedAt)).limit(limit).offset(offset);

  if (tag) {
    items = items.filter(p => (p.tags as string[] | null)?.includes(tag));
  }

  return { items, pagination: { page, limit, total: Number(count), totalPages: Math.ceil(Number(count) / limit) } };
}

export async function getPostBySlug(slug: string) {
  const [post] = await db.select().from(blogPosts).where(and(eq(blogPosts.slug, slug), eq(blogPosts.isPublished, true)));
  return post ?? null;
}

export async function getAllPosts(query: BlogQueryInput) {
  const { page, limit } = query;
  const offset = (page - 1) * limit;
  const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(blogPosts);
  const items = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt)).limit(limit).offset(offset);
  return { items, pagination: { page, limit, total: Number(count), totalPages: Math.ceil(Number(count) / limit) } };
}

export async function getPostById(id: string) {
  const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
  return post ?? null;
}

export async function createPost(data: CreateBlogPostInput) {
  const [post] = await db.insert(blogPosts).values({
    ...data,
    publishedAt: data.isPublished ? new Date() : null,
  }).returning();
  return post;
}

export async function updatePost(id: string, data: UpdateBlogPostInput) {
  const updates: Record<string, unknown> = { ...data, updatedAt: new Date() };
  if (data.isPublished !== undefined) {
    const existing = await getPostById(id);
    if (data.isPublished && !existing?.publishedAt) updates.publishedAt = new Date();
  }
  const [updated] = await db.update(blogPosts).set(updates).where(eq(blogPosts.id, id)).returning();
  return updated ?? null;
}

export async function deletePost(id: string) {
  const [deleted] = await db.delete(blogPosts).where(eq(blogPosts.id, id)).returning({ id: blogPosts.id });
  return deleted ?? null;
}
