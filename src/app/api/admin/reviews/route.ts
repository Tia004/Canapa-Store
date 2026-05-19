import { NextResponse } from 'next/server';
import { createReviewSchema, reviewQuerySchema } from '@/lib/validators/review.schema';
import { getAllReviews, createReview } from '@/lib/services/review.service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = reviewQuerySchema.parse(Object.fromEntries(searchParams));
    
    const result = await getAllReviews(query);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('[Admin] Reviews GET error:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createReviewSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dati non validi', details: parsed.error.flatten() }, 
        { status: 400 }
      );
    }

    const review = await createReview(parsed.data);
    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (error) {
    console.error('[Admin] Reviews POST error:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}
