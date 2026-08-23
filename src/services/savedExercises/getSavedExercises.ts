import type { SupabaseClient } from '@supabase/supabase-js';
import { isLocale, type Locale } from '@/i18n/i18n';
import { localizeExercise } from '@/lib/exercises';
import type { ExerciseRow, SavedExercisesResponse } from '@/types/exercises';

/**
 * Builds the authenticated user's saved exercise library.
 *
 * The first query reads only exercise IDs owned by `userId`. If any exist, one second catalogue
 * query fetches all matching exercises with translations and images. This fixed two-query approach
 * avoids the N+1 pattern where every saved row would trigger another database request. The user ID
 * is supplied by the authenticated API route—not by request JSON—and Supabase RLS remains an
 * additional authorization boundary.
 */
export async function getSavedExercises(
  supabase: SupabaseClient,
  userId: string,
  requestedLocale?: string
): Promise<SavedExercisesResponse> {
  const locale: Locale = requestedLocale && isLocale(requestedLocale) ? requestedLocale : 'en';
  const saved = await supabase.from('saved_exercises').select('exercise_id').eq('user_id', userId);
  if (saved.error) throw new Error(saved.error.message);
  const ids = saved.data.map((row) => String(row.exercise_id));
  if (ids.length === 0) return { exercises: [] };

  const catalogue = await supabase
    .from('exercises')
    .select(
      'id,name,category,description,exercise_translations(locale,name,description),exercise_images(image_path,sort_order)'
    )
    .in('id', ids)
    .eq('exercise_translations.locale', locale)
    .order('name');
  if (catalogue.error) throw new Error(catalogue.error.message);
  return {
    exercises: (catalogue.data as unknown as ExerciseRow[]).map((row) =>
      localizeExercise(row, locale)
    ),
  };
}
