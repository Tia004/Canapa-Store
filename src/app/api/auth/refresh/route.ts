import { NextResponse } from 'next/server';
import { getRefreshTokenCookie, setAccessTokenCookie } from '@/lib/auth/cookies';
import { verifyRefreshToken, signAccessToken } from '@/lib/auth/jwt';

export async function POST() {
  try {
    const refreshToken = await getRefreshTokenCookie();
    if (!refreshToken) return NextResponse.json({ error: 'Refresh token mancante' }, { status: 401 });

    const payload = await verifyRefreshToken(refreshToken);
    if (!payload) return NextResponse.json({ error: 'Refresh token non valido' }, { status: 401 });

    const newAccessToken = await signAccessToken({ sub: payload.sub, email: payload.email, role: payload.role });
    await setAccessTokenCookie(newAccessToken);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Auth] Refresh error:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}
