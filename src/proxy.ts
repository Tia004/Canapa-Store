import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

/**
 * Next.js Edge Middleware
 * 
 * - Protects /api/admin/* routes (requires valid admin JWT)
 * - All other routes pass through freely
 * - Assigns cart session cookie to anonymous visitors
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Admin route protection ──────────────────────────────────────────────
  if (pathname.startsWith('/api/admin')) {
    // Allow admin login without auth
    if (pathname === '/api/admin/login') {
      return NextResponse.next();
    }

    const adminToken = request.cookies.get('admin_token')?.value;

    if (!adminToken) {
      return NextResponse.json(
        { error: 'Unauthorized — admin access required' },
        { status: 401 }
      );
    }

    try {
      const { payload } = await jwtVerify(adminToken, JWT_SECRET);
      if (payload.role !== 'admin') {
        return NextResponse.json(
          { error: 'Forbidden — admin role required' },
          { status: 403 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: 'Invalid or expired admin token' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protect all admin API routes
    '/api/admin/:path*',
  ],
};
