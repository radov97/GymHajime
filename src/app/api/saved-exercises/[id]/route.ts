import { NextResponse } from 'next/server';
import { bearerToken, createServerSupabaseClient } from '@/lib/supabase/server';
import { deleteSavedExercise } from '@/services/savedExercises/deleteSavedExercise';

interface Context {
  params: Promise<{ id: string }>;
}

/**
 * Handles `DELETE /api/saved-exercises/:id`, where `id` is the exercise UUID.
 *
 * The handler extracts and verifies the bearer token, validates the route parameter, and calls the
 * deletion service with the verified user ID. Supplying both IDs ensures this request can remove
 * only the current user's saved relationship. Known client problems return 400/401 while an
 * unexpected service or database failure becomes HTTP 500.
 */
export async function DELETE(request: Request, context: Context) {
  const token = bearerToken(request);
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const supabase = createServerSupabaseClient(token);
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await context.params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.json({ error: 'Invalid exercise id' }, { status: 400 });
  }
  try {
    return NextResponse.json(await deleteSavedExercise(supabase, data.user.id, id));
  } catch {
    return NextResponse.json({ error: 'Unable to remove saved exercise' }, { status: 500 });
  }
}
