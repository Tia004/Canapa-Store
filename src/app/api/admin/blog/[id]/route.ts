import { NextResponse } from 'next/server';
import { updateBlogPostSchema } from '@/lib/validators/blog.schema';
import { getPostById, updatePost, deletePost } from '@/lib/services/blog.service';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const post = await getPostById(id);
    if (!post) return NextResponse.json({ error: 'Articolo non trovato' }, { status: 404 });
    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error('[Admin] Blog GET error:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateBlogPostSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Dati non validi', details: parsed.error.flatten() }, { status: 400 });

    const updated = await updatePost(id, parsed.data);
    if (!updated) return NextResponse.json({ error: 'Articolo non trovato' }, { status: 404 });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('[Admin] Blog PATCH error:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const deleted = await deletePost(id);
    if (!deleted) return NextResponse.json({ error: 'Articolo non trovato' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Admin] Blog DELETE error:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}
