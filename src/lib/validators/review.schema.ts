import { z } from 'zod';

export const createReviewSchema = z.object({
  authorName: z.string().min(1, 'Il nome autore è richiesto').max(100),
  initials: z.string().min(1, 'Le iniziali sono richieste').max(10),
  rating: z.number().int().min(1).max(5),
  text: z.string().min(1, 'Il testo della recensione è richiesto'),
  productId: z.string().uuid('ID prodotto non valido').nullable().optional(),
  isPublished: z.boolean().default(false),
});

export const updateReviewSchema = createReviewSchema.partial();

export const reviewQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  isPublished: z.union([z.literal('true'), z.literal('false')]).optional().transform((val) => val === 'true' ? true : val === 'false' ? false : undefined),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
export type ReviewQueryInput = z.infer<typeof reviewQuerySchema>;
