import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users, userAddresses } from '@/lib/db/schema';
import { hashPassword, comparePassword } from '@/lib/auth/passwords';
import type { RegisterInput, UpdateProfileInput, AddressInput } from '@/lib/validators/auth.schema';

/**
 * Create a new user account
 */
export async function createUser(data: RegisterInput) {
  const passwordHash = await hashPassword(data.password);

  const [user] = await db.insert(users).values({
    email: data.email.toLowerCase().trim(),
    passwordHash,
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    phone: data.phone?.trim(),
  }).returning({
    id: users.id,
    email: users.email,
    firstName: users.firstName,
    lastName: users.lastName,
  });

  return user;
}

/**
 * Find a user by email and verify password
 */
export async function verifyUserCredentials(email: string, password: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase().trim()));

  if (!user) return null;
  if (!user.isActive) return null;

  const isValid = await comparePassword(password, user.passwordHash);
  if (!isValid) return null;

  // Update last login
  await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, user.id));

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
  };
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string) {
  const [user] = await db.select({
    id: users.id,
    email: users.email,
    firstName: users.firstName,
    lastName: users.lastName,
    phone: users.phone,
    address: users.address,
    city: users.city,
    province: users.province,
    zipCode: users.zipCode,
    country: users.country,
    isVerified: users.isVerified,
    createdAt: users.createdAt,
  }).from(users).where(eq(users.id, userId));

  return user ?? null;
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase().trim()));
  return user ?? null;
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId: string, data: UpdateProfileInput) {
  const [updated] = await db.update(users).set({
    ...data,
    updatedAt: new Date(),
  }).where(eq(users.id, userId)).returning({
    id: users.id,
    email: users.email,
    firstName: users.firstName,
    lastName: users.lastName,
    phone: users.phone,
  });

  return updated ?? null;
}

/**
 * Get all addresses for a user
 */
export async function getUserAddresses(userId: string) {
  return db.select().from(userAddresses).where(eq(userAddresses.userId, userId));
}

/**
 * Add an address for a user
 */
export async function addUserAddress(userId: string, data: AddressInput) {
  // If setting as default, unset all others first
  if (data.isDefault) {
    await db.update(userAddresses)
      .set({ isDefault: false })
      .where(eq(userAddresses.userId, userId));
  }

  const [address] = await db.insert(userAddresses).values({
    userId,
    ...data,
  }).returning();

  return address;
}

/**
 * Delete a user address
 */
export async function deleteUserAddress(userId: string, addressId: string) {
  const [deleted] = await db.delete(userAddresses)
    .where(eq(userAddresses.id, addressId))
    .returning();

  return deleted ?? null;
}
