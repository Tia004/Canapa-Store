import { NextResponse } from 'next/server';
import { registerSchema } from '@/lib/validators/auth.schema';
import { createUser, getUserByEmail } from '@/lib/services/user.service';
import { signAccessToken, signRefreshToken } from '@/lib/auth/jwt';
import { setAccessTokenCookie, setRefreshTokenCookie } from '@/lib/auth/cookies';
import { sendWelcomeEmail } from '@/lib/services/email.service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Dati non validi', details: parsed.error.flatten() }, { status: 400 });

    const existing = await getUserByEmail(parsed.data.email);
    if (existing) return NextResponse.json({ error: 'Email già registrata' }, { status: 409 });

    const user = await createUser(parsed.data);
    const accessToken = await signAccessToken({ sub: user.id, email: user.email, role: 'user' });
    const refreshToken = await signRefreshToken({ sub: user.id, email: user.email, role: 'user' });

    await setAccessTokenCookie(accessToken);
    await setRefreshTokenCookie(refreshToken);

    // Send welcome email (don't await — fire and forget)
    sendWelcomeEmail(user.email, user.firstName).catch(console.error);

    return NextResponse.json({ success: true, data: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } }, { status: 201 });
  } catch (error) {
    console.error('[Auth] Register error:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}
