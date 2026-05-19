import { NextResponse } from 'next/server';
import { blogQuerySchema } from '@/lib/validators/blog.schema';
import { getPublishedPosts } from '@/lib/services/blog.service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = blogQuerySchema.parse(Object.fromEntries(searchParams));
    const result = await getPublishedPosts(query);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('[Blog] GET error:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}
