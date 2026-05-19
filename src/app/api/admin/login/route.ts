import { NextResponse } from 'next/server';
import { adminLoginSchema } from '@/lib/validators/auth.schema';
import { comparePassword } from '@/lib/auth/passwords';
import { signAccessToken } from '@/lib/auth/jwt';
import { setAdminTokenCookie } from '@/lib/auth/cookies';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = adminLoginSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Credenziali non valide' }, { status: 400 });

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
    if (!adminEmail || !adminPasswordHash) return NextResponse.json({ error: 'Admin non configurato' }, { status: 500 });

    if (parsed.data.email !== adminEmail) return NextResponse.json({ error: 'Credenziali errate' }, { status: 401 });

    const valid = await comparePassword(parsed.data.password, adminPasswordHash);
    if (!valid) return NextResponse.json({ error: 'Credenziali errate' }, { status: 401 });

    const token = await signAccessToken({ sub: 'admin', email: adminEmail, role: 'admin' });
    await setAdminTokenCookie(token);

    return NextResponse.json({ success: true, data: { email: adminEmail, role: 'admin' } });
  } catch (error) {
    console.error('[Admin] Login error:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}
