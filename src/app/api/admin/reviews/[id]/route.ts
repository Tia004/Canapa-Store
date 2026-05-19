import { NextResponse } from 'next/server';
import { updateReviewSchema } from '@/lib/validators/review.schema';
import { getReviewById, updateReview, deleteReview } from '@/lib/services/review.service';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const review = await getReviewById(id);
    
    if (!review) {
      return NextResponse.json({ error: 'Recensione non trovata' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: review });
  } catch (error) {
    console.error('[Admin] Review GET error:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateReviewSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dati non validi', details: parsed.error.flatten() }, 
        { status: 400 }
      );
    }

    const updated = await updateReview(id, parsed.data);
    
    if (!updated) {
      return NextResponse.json({ error: 'Recensione non trovata' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('[Admin] Review PATCH error:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const deleted = await deleteReview(id);
    
    if (!deleted) {
      return NextResponse.json({ error: 'Recensione non trovata' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Admin] Review DELETE error:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
}
