import { NextResponse } from 'next/server';
import { bearerToken, createServerSupabaseClient } from '@/lib/supabase/server';
import { getExerciseById } from '@/services/exercises/getExerciseById';

interface Context {
  params: Promise<{ id: string }>;
}

/**
 * Handles `GET /api/exercises/:id` for one exercise's complete details.
 *
 * The bearer token is verified first so catalogue RLS sees the authenticated user. Next.js supplies
 * dynamic route parameters through `context.params`; the handler validates that the path value is
 * a UUID, forwards the optional locale, and maps the result to 200, 404, or 500 HTTP responses.
 */
export async function GET(request: Request, context: Context) {
  const token = bearerToken(request);
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const supabase = createServerSupabaseClient(token);
  const { data: auth, error: authError } = await supabase.auth.getUser(token);
  if (authError || !auth.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return NextResponse.json({ error: 'Invalid exercise id' }, { status: 400 });
  }
  try {
    const exercise = await getExerciseById(
      supabase,
      id,
      new URL(request.url).searchParams.get('locale') ?? undefined
    );
    return exercise
      ? NextResponse.json(exercise)
      : NextResponse.json({ error: 'Exercise not found' }, { status: 404 });
  } catch {
    return NextResponse.json({ error: 'Unable to load exercise' }, { status: 500 });
  }
}
