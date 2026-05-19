import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Indirizzo email non valido'),
  password: z.string()
    .min(8, 'La password deve essere di almeno 8 caratteri')
    .regex(/[A-Z]/, 'La password deve contenere almeno una lettera maiuscola')
    .regex(/[0-9]/, 'La password deve contenere almeno un numero'),
  firstName: z.string().min(1, 'Nome richiesto').max(100),
  lastName: z.string().min(1, 'Cognome richiesto').max(100),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Indirizzo email non valido'),
  password: z.string().min(1, 'Password richiesta'),
});

export const adminLoginSchema = z.object({
  email: z.string().email('Indirizzo email non valido'),
  password: z.string().min(1, 'Password richiesta'),
});

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  phone: z.string().max(30).optional(),
  address: z.string().optional(),
  city: z.string().max(100).optional(),
  province: z.string().max(100).optional(),
  zipCode: z.string().max(20).optional(),
  country: z.string().length(2).optional(),
});

export const addressSchema = z.object({
  label: z.string().max(50).optional(),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  address: z.string().min(1),
  city: z.string().min(1).max(100),
  province: z.string().min(1).max(100),
  zipCode: z.string().min(1).max(20),
  country: z.string().length(2).default('IT'),
  phone: z.string().max(30).optional(),
  isDefault: z.boolean().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
