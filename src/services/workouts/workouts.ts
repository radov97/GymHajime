import type { SupabaseClient } from '@supabase/supabase-js';
import { isLocale, type Locale } from '@/i18n/i18n';
import { localizeExercise } from '@/lib/exercises';
import type { ExerciseRow } from '@/types/exercises';
import type { SaveWorkoutInput, Workout, WorkoutExercise } from '@/types/workouts';

interface WorkoutRow {
  id: string;
  day_of_week: number;
  name: string | null;
}

interface WorkoutExerciseRow {
  id: string;
  exercise_id: string;
  sets: number | null;
  reps: number | null;
  weight: number | null;
  duration_minutes: number | null;
  sort_order: number;
}

/**
 * Resolves stored exercise IDs into the localized, image-backed representation returned by the
 * HTTP API. Catalogue presentation data remains outside `workout_exercises` by design.
 */
async function hydrateWorkout(
  supabase: SupabaseClient,
  workout: WorkoutRow,
  requestedLocale?: string
): Promise<Workout> {
  const locale: Locale = requestedLocale && isLocale(requestedLocale) ? requestedLocale : 'en';
  const rows = await supabase
    .from('workout_exercises')
    .select('id,exercise_id,sets,reps,weight,duration_minutes,sort_order')
    .eq('workout_id', workout.id)
    .order('sort_order');
  if (rows.error) throw new Error(rows.error.message);
  const exerciseRows = rows.data as WorkoutExerciseRow[];
  const ids = exerciseRows.map((row) => row.exercise_id);
  let catalogue: ExerciseRow[] = [];
  if (ids.length) {
    const result = await supabase
      .from('exercises')
      .select(
        'id,name,category,description,exercise_translations(locale,name,description),exercise_images(image_path,sort_order)'
      )
      .in('id', ids)
      .eq('exercise_translations.locale', locale);
    if (result.error) throw new Error(result.error.message);
    catalogue = result.data as unknown as ExerciseRow[];
  }
  const byId = new Map(catalogue.map((row) => [row.id, localizeExercise(row, locale)]));
  const exercises = exerciseRows.flatMap((row): WorkoutExercise[] => {
    const exercise = byId.get(row.exercise_id);
    return exercise
      ? [
          {
            id: row.id,
            exerciseId: row.exercise_id,
            name: exercise.name,
            category: exercise.category,
            imageUrl: exercise.images[0]?.url ?? null,
            sets: row.sets,
            reps: row.reps,
            weight: row.weight,
            durationMinutes: row.duration_minutes,
            sortOrder: row.sort_order,
            details: exercise,
          },
        ]
      : [];
  });
  return { id: workout.id, dayOfWeek: workout.day_of_week, name: workout.name, exercises };
}

/** Finds the current user's single workout container for a weekday, if one exists. */
export async function getWorkoutByDay(
  supabase: SupabaseClient,
  userId: string,
  day: number,
  locale?: string
): Promise<Workout | null> {
  const result = await supabase
    .from('workouts')
    .select('id,day_of_week,name')
    .eq('user_id', userId)
    .eq('day_of_week', day)
    .maybeSingle();
  if (result.error) throw new Error(result.error.message);
  return result.data ? hydrateWorkout(supabase, result.data as WorkoutRow, locale) : null;
}

/**
 * Reconciles a complete client draft with the workout rows stored for one weekday.
 *
 * Existing rows are first moved beyond both the old and desired order ranges. This avoids the
 * `(workout_id, sort_order)` unique constraint while exercises exchange positions. Desired rows
 * are then upserted and omitted rows removed. Supabase's data API cannot make these calls one
 * database transaction; a future PostgreSQL RPC is required if rollback-on-failure is needed.
 */
export async function saveWorkoutByDay(
  supabase: SupabaseClient,
  userId: string,
  day: number,
  input: SaveWorkoutInput,
  locale?: string
): Promise<Workout | null> {
  if (input.exercises.length) {
    const catalogueResult = await supabase
      .from('exercises')
      .select('id,category')
      .in(
        'id',
        input.exercises.map((exercise) => exercise.exerciseId)
      );
    if (catalogueResult.error) throw new Error(catalogueResult.error.message);
    const categories = new Map(
      catalogueResult.data.map((exercise) => [String(exercise.id), String(exercise.category)])
    );
    const invalidPrescription = input.exercises.some((exercise) => {
      const category = categories.get(exercise.exerciseId);
      if (!category) return true;
      return category === 'cardio'
        ? exercise.durationMinutes === null
        : exercise.durationMinutes !== null;
    });
    if (invalidPrescription) throw new Error('Exercise prescription does not match its category');
  }

  const existing = await supabase
    .from('workouts')
    .select('id,day_of_week,name')
    .eq('user_id', userId)
    .eq('day_of_week', day)
    .maybeSingle();
  if (existing.error) throw new Error(existing.error.message);
  if (!existing.data && input.exercises.length === 0 && !input.name) return null;

  const savedWorkout = await supabase
    .from('workouts')
    .upsert(
      { user_id: userId, day_of_week: day, name: input.name },
      { onConflict: 'user_id,day_of_week' }
    )
    .select('id,day_of_week,name')
    .single();
  if (savedWorkout.error) throw new Error(savedWorkout.error.message);
  const workout = savedWorkout.data as WorkoutRow;

  const current = await supabase
    .from('workout_exercises')
    .select('id,exercise_id,sort_order')
    .eq('workout_id', workout.id);
  if (current.error) throw new Error(current.error.message);

  // Move current rows beyond both order ranges first, preventing unique sort-order collisions.
  const temporaryOrderStart =
    Math.max(input.exercises.length, ...current.data.map((row) => Number(row.sort_order))) + 1;
  for (const [index, row] of current.data.entries()) {
    const moved = await supabase
      .from('workout_exercises')
      .update({ sort_order: temporaryOrderStart + index })
      .eq('id', row.id)
      .eq('workout_id', workout.id);
    if (moved.error) throw new Error(moved.error.message);
  }

  if (input.exercises.length) {
    const upserted = await supabase.from('workout_exercises').upsert(
      input.exercises.map((exercise) => ({
        workout_id: workout.id,
        exercise_id: exercise.exerciseId,
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight,
        duration_minutes: exercise.durationMinutes,
        sort_order: exercise.sortOrder,
      })),
      { onConflict: 'workout_id,exercise_id' }
    );
    if (upserted.error) throw new Error(upserted.error.message);
  }

  const desiredIds = new Set(input.exercises.map((exercise) => exercise.exerciseId));
  const removedIds = current.data
    .filter((row) => !desiredIds.has(String(row.exercise_id)))
    .map((row) => String(row.id));
  if (removedIds.length) {
    const removed = await supabase
      .from('workout_exercises')
      .delete()
      .eq('workout_id', workout.id)
      .in('id', removedIds);
    if (removed.error) throw new Error(removed.error.message);
  }
  return hydrateWorkout(supabase, workout, locale);
}

/** Deletes a weekday workout and its exercise rows without relying on foreign-key cascade setup. */
export async function deleteWorkoutByDay(
  supabase: SupabaseClient,
  userId: string,
  day: number
): Promise<void> {
  const workout = await supabase
    .from('workouts')
    .select('id')
    .eq('user_id', userId)
    .eq('day_of_week', day)
    .maybeSingle();
  if (workout.error) throw new Error(workout.error.message);
  if (!workout.data) return;

  const exercises = await supabase
    .from('workout_exercises')
    .delete()
    .eq('workout_id', workout.data.id);
  if (exercises.error) throw new Error(exercises.error.message);
  const deleted = await supabase
    .from('workouts')
    .delete()
    .eq('user_id', userId)
    .eq('id', workout.data.id);
  if (deleted.error) throw new Error(deleted.error.message);
}

/**
 * Moves a workout container and all related exercise rows to another weekday.
 * Any target workout is deleted first because `(user_id, day_of_week)` is unique. These calls are
 * not transactional through Supabase's data API; a database RPC is required for atomic rollback.
 */
export async function moveWorkoutToDay(
  supabase: SupabaseClient,
  userId: string,
  sourceDay: number,
  targetDay: number,
  locale?: string
): Promise<Workout | null> {
  const source = await supabase
    .from('workouts')
    .select('id,day_of_week,name')
    .eq('user_id', userId)
    .eq('day_of_week', sourceDay)
    .maybeSingle();
  if (source.error) throw new Error(source.error.message);
  if (!source.data) return null;
  if (sourceDay === targetDay) return hydrateWorkout(supabase, source.data as WorkoutRow, locale);

  await deleteWorkoutByDay(supabase, userId, targetDay);
  const moved = await supabase
    .from('workouts')
    .update({ day_of_week: targetDay })
    .eq('id', source.data.id)
    .eq('user_id', userId)
    .select('id,day_of_week,name')
    .single();
  if (moved.error) throw new Error(moved.error.message);
  return hydrateWorkout(supabase, moved.data as WorkoutRow, locale);
}
