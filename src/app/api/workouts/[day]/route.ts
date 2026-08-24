import { NextResponse } from 'next/server';
import { bearerToken, createServerSupabaseClient } from '@/lib/supabase/server';
import {
  deleteWorkoutByDay,
  moveWorkoutToDay,
  saveWorkoutByDay,
} from '@/services/workouts/workouts';
import type { SaveWorkoutExerciseInput, SaveWorkoutInput } from '@/types/workouts';

interface Context {
  params: Promise<{ day: string }>;
}
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Validates row constraints before PostgreSQL sees the complete draft. */
function validExercise(value: unknown): value is SaveWorkoutExerciseInput {
  if (typeof value !== 'object' || value === null) return false;
  const row = value as Record<string, unknown>;
  const repetitionPrescription =
    Number.isInteger(row.sets) &&
    Number(row.sets) > 0 &&
    Number.isInteger(row.reps) &&
    Number(row.reps) > 0 &&
    (row.weight === null ||
      (typeof row.weight === 'number' && Number.isFinite(row.weight) && row.weight >= 0)) &&
    row.durationMinutes === null;
  const durationPrescription =
    row.sets === null &&
    row.reps === null &&
    row.weight === null &&
    Number.isInteger(row.durationMinutes) &&
    Number(row.durationMinutes) > 0;
  return (
    typeof row.exerciseId === 'string' &&
    uuid.test(row.exerciseId) &&
    (repetitionPrescription || durationPrescription) &&
    Number.isInteger(row.sortOrder) &&
    Number(row.sortOrder) > 0
  );
}

/**
 * Replaces the authenticated user's workout configuration for the weekday in the route.
 * The route rejects duplicate exercises and non-consecutive ordering before calling the service.
 */
export async function PUT(request: Request, context: Context) {
  const token = bearerToken(request);
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const supabase = createServerSupabaseClient(token);
  const auth = await supabase.auth.getUser(token);
  if (auth.error || !auth.data.user)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const day = Number((await context.params).day);
  if (!Number.isInteger(day) || day < 1 || day > 7)
    return NextResponse.json({ error: 'Invalid weekday' }, { status: 400 });
  const body: unknown = await request.json().catch(() => null);
  if (typeof body !== 'object' || body === null)
    return NextResponse.json({ error: 'Invalid workout' }, { status: 400 });
  const value = body as { name?: unknown; exercises?: unknown };
  if (
    !(value.name === null || typeof value.name === 'string') ||
    !Array.isArray(value.exercises) ||
    !value.exercises.every(validExercise)
  )
    return NextResponse.json({ error: 'Invalid workout' }, { status: 400 });
  const exercises = value.exercises as SaveWorkoutExerciseInput[];
  if (
    new Set(exercises.map((row) => row.exerciseId)).size !== exercises.length ||
    exercises.some((row, index) => row.sortOrder !== index + 1)
  )
    return NextResponse.json(
      { error: 'Exercises must be unique and ordered consecutively' },
      { status: 400 }
    );
  const input: SaveWorkoutInput = {
    name: (value.name as string | null)?.trim() || null,
    exercises,
  };
  try {
    const locale = new URL(request.url).searchParams.get('locale') ?? undefined;
    return NextResponse.json({
      workout: await saveWorkoutByDay(supabase, auth.data.user.id, day, input, locale),
    });
  } catch {
    return NextResponse.json({ error: 'Unable to save workout' }, { status: 500 });
  }
}

/** Deletes all persisted workout data for the authenticated user's selected weekday. */
export async function DELETE(request: Request, context: Context) {
  const token = bearerToken(request);
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const supabase = createServerSupabaseClient(token);
  const auth = await supabase.auth.getUser(token);
  if (auth.error || !auth.data.user)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const day = Number((await context.params).day);
  if (!Number.isInteger(day) || day < 1 || day > 7)
    return NextResponse.json({ error: 'Invalid weekday' }, { status: 400 });
  try {
    await deleteWorkoutByDay(supabase, auth.data.user.id, day);
    return NextResponse.json({ workout: null });
  } catch {
    return NextResponse.json({ error: 'Unable to clear workout' }, { status: 500 });
  }
}

/** Moves a persisted workout to `targetDay`, replacing the target weekday's current workout. */
export async function PATCH(request: Request, context: Context) {
  const token = bearerToken(request);
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const supabase = createServerSupabaseClient(token);
  const auth = await supabase.auth.getUser(token);
  if (auth.error || !auth.data.user)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const sourceDay = Number((await context.params).day);
  const body: unknown = await request.json().catch(() => null);
  const targetDay =
    typeof body === 'object' && body !== null && 'targetDay' in body
      ? Number((body as { targetDay: unknown }).targetDay)
      : NaN;
  if (
    !Number.isInteger(sourceDay) ||
    sourceDay < 1 ||
    sourceDay > 7 ||
    !Number.isInteger(targetDay) ||
    targetDay < 1 ||
    targetDay > 7 ||
    targetDay === sourceDay
  )
    return NextResponse.json({ error: 'A different target weekday is required' }, { status: 400 });
  try {
    const locale = new URL(request.url).searchParams.get('locale') ?? undefined;
    const workout = await moveWorkoutToDay(
      supabase,
      auth.data.user.id,
      sourceDay,
      targetDay,
      locale
    );
    if (!workout) return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
    return NextResponse.json({ workout });
  } catch {
    return NextResponse.json({ error: 'Unable to move workout' }, { status: 500 });
  }
}
