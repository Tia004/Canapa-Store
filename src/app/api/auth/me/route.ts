import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth/middleware';
import { getUserById } from '@/lib/services/user.service';

export async function GET() {
  try {
    const payload = await authenticateRequest();
    if (!payload) return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });

    const user = await getUserById(payload.sub);
    if (!user) return NextResponse.json({ error: 'Utente non trovato' }, { status: 404 });

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error('[Auth] Me error:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}
