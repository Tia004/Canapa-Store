import { NextResponse } from 'next/server';
import { getPostBySlug } from '@/lib/services/blog.service';

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    if (!post) return NextResponse.json({ error: 'Articolo non trovato' }, { status: 404 });
    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error('[Blog] Slug GET error:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}
