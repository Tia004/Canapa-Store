import { NextResponse } from 'next/server';
import { createBlogPostSchema } from '@/lib/validators/blog.schema';
import { blogQuerySchema } from '@/lib/validators/blog.schema';
import { getAllPosts, createPost } from '@/lib/services/blog.service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = blogQuerySchema.parse(Object.fromEntries(searchParams));
    const result = await getAllPosts(query);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('[Admin] Blog GET error:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createBlogPostSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Dati non validi', details: parsed.error.flatten() }, { status: 400 });

    const post = await createPost(parsed.data);
    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (error) {
    console.error('[Admin] Blog POST error:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}
