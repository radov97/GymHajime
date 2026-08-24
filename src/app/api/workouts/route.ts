import { NextResponse } from 'next/server';
import { bearerToken, createServerSupabaseClient } from '@/lib/supabase/server';
import { getWeeklyWorkouts, getWorkoutByDay } from '@/services/workouts/workouts';

/**
 * Returns the authenticated user's localized workout for `?day=1..7`.
 * User ownership is derived from the verified bearer token and never from query parameters.
 */
export async function GET(request: Request) {
  const token = bearerToken(request);
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const supabase = createServerSupabaseClient(token);
  const auth = await supabase.auth.getUser(token);
  if (auth.error || !auth.data.user)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const url = new URL(request.url);
  const dayParameter = url.searchParams.get('day');
  const locale = url.searchParams.get('locale') ?? undefined;
  if (dayParameter === null) {
    try {
      return NextResponse.json({
        workouts: await getWeeklyWorkouts(supabase, auth.data.user.id, locale),
      });
    } catch {
      return NextResponse.json({ error: 'Unable to load schedule' }, { status: 500 });
    }
  }
  const day = Number(dayParameter);
  if (!Number.isInteger(day) || day < 1 || day > 7)
    return NextResponse.json({ error: 'day must be an integer from 1 to 7' }, { status: 400 });
  try {
    const workout = await getWorkoutByDay(supabase, auth.data.user.id, day, locale);
    return NextResponse.json({ workout });
  } catch {
    return NextResponse.json({ error: 'Unable to load workout' }, { status: 500 });
  }
}
