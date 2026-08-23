import { NextResponse } from 'next/server';
import { bearerToken, createServerSupabaseClient } from '@/lib/supabase/server';
import { getSavedExercises } from '@/services/savedExercises/getSavedExercises';
import { saveExercise } from '@/services/savedExercises/saveExercise';

/**
 * Authenticates an incoming API request and creates its user-scoped Supabase client.
 *
 * Reading a JWT is not sufficient proof that it is valid, so the token is sent to
 * `supabase.auth.getUser()`. Supabase verifies it and returns the canonical user identity. Route
 * handlers use that identity instead of trusting a `user_id` supplied by the frontend.
 */
async function authenticated(request: Request) {
  const token = bearerToken(request);
  if (!token) return null;
  const supabase = createServerSupabaseClient(token);
  const { data, error } = await supabase.auth.getUser(token);
  return error || !data.user ? null : { supabase, user: data.user };
}

/**
 * Handles `GET /api/saved-exercises` for the current user.
 *
 * Authentication happens before the service is called. A missing or invalid token produces 401;
 * otherwise the verified user ID and requested locale are passed to the saved-exercise service.
 */
export async function GET(request: Request) {
  const auth = await authenticated(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const result = await getSavedExercises(
      auth.supabase,
      auth.user.id,
      new URL(request.url).searchParams.get('locale') ?? undefined
    );
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Unable to load saved exercises' }, { status: 500 });
  }
}

/**
 * Handles `POST /api/saved-exercises` to save one catalogue exercise.
 *
 * The JSON body may contain only the target `exerciseId`; ownership always comes from the verified
 * session. The handler validates the body, delegates the idempotent upsert to the service, and
 * returns HTTP 201 when the saved relationship is established.
 */
export async function POST(request: Request) {
  const auth = await authenticated(request);
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body: unknown = await request.json().catch(() => null);
  const exerciseId =
    typeof body === 'object' && body !== null && 'exerciseId' in body
      ? (body as { exerciseId?: unknown }).exerciseId
      : undefined;
  if (typeof exerciseId !== 'string' || !/^[0-9a-f-]{36}$/i.test(exerciseId)) {
    return NextResponse.json({ error: 'A valid exerciseId is required' }, { status: 400 });
  }
  try {
    return NextResponse.json(await saveExercise(auth.supabase, auth.user.id, exerciseId), {
      status: 201,
    });
  } catch {
    return NextResponse.json({ error: 'Unable to save exercise' }, { status: 500 });
  }
}
