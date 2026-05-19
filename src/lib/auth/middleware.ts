import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken, type TokenPayload } from './jwt';
import { getAccessTokenCookie, getAdminTokenCookie } from './cookies';

/**
 * API response helpers
 */
export function jsonResponse(data: unknown, status = 200): NextResponse {
  return NextResponse.json(data, { status });
}

export function errorResponse(message: string, status = 400): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Authenticate a request and return the user payload.
 * Use this inside API route handlers.
 */
export async function authenticateRequest(): Promise<TokenPayload | null> {
  const token = await getAccessTokenCookie();
  if (!token) return null;
  return verifyAccessToken(token);
}

/**
 * Require authentication — returns user payload or throws error response.
 * Use this for protected API routes.
 */
export async function requireAuth(): Promise<TokenPayload> {
  const user = await authenticateRequest();
  if (!user) {
    throw new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return user;
}

/**
 * Require admin authentication.
 * Checks the admin token cookie and verifies the role.
 */
export async function requireAdmin(): Promise<TokenPayload> {
  const token = await getAdminTokenCookie();
  if (!token) {
    throw new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const payload = await verifyAccessToken(token);
  if (!payload || payload.role !== 'admin') {
    throw new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return payload;
}

/**
 * Middleware helper: verify token from request cookies (for Edge Runtime).
 * Used in src/middleware.ts
 */
export async function verifyTokenFromRequest(request: NextRequest): Promise<TokenPayload | null> {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return null;
  return verifyAccessToken(token);
}
