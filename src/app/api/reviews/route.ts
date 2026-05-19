import { NextResponse } from 'next/server';
import { getPublishedReviews } from '@/lib/services/review.service';

export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
  try {
    const reviews = await getPublishedReviews();
    return NextResponse.json({ success: true, data: reviews });
  } catch (error) {
    console.error('[Public] Reviews GET error:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}
