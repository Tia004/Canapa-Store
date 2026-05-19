import { NextResponse } from 'next/server';
import { loginSchema } from '@/lib/validators/auth.schema';
import { verifyUserCredentials } from '@/lib/services/user.service';
import { signAccessToken, signRefreshToken } from '@/lib/auth/jwt';
import { setAccessTokenCookie, setRefreshTokenCookie, getCartSession } from '@/lib/auth/cookies';
import { mergeCart } from '@/lib/services/cart.service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Credenziali non valide' }, { status: 400 });

    const user = await verifyUserCredentials(parsed.data.email, parsed.data.password);
    if (!user) return NextResponse.json({ error: 'Email o password errati' }, { status: 401 });

    const accessToken = await signAccessToken({ sub: user.id, email: user.email, role: 'user' });
    const refreshToken = await signRefreshToken({ sub: user.id, email: user.email, role: 'user' });

    await setAccessTokenCookie(accessToken);
    await setRefreshTokenCookie(refreshToken);

    // Merge anonymous cart into user cart
    const sessionId = await getCartSession();
    if (sessionId) {
      mergeCart(sessionId, user.id).catch(console.error);
    }

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error('[Auth] Login error:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}
