import { z } from 'zod';

export const createBlogPostSchema = z.object({
  title: z.string().min(1, 'Titolo richiesto').max(255),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug non valido'),
  content: z.string().min(1, 'Contenuto richiesto'),
  excerpt: z.string().max(500).optional(),
  coverImage: z.string().url().optional(),
  authorName: z.string().min(1).max(100),
  tags: z.array(z.string()).default([]),
  metaTitle: z.string().max(255).optional(),
  metaDescription: z.string().optional(),
  isPublished: z.boolean().default(false),
});

export const updateBlogPostSchema = createBlogPostSchema.partial();

export const blogQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  tag: z.string().optional(),
  search: z.string().optional(),
});

export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;
export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>;
export type BlogQueryInput = z.infer<typeof blogQuerySchema>;
