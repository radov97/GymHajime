import type { SupabaseClient } from '@supabase/supabase-js';
import { isLocale, type Locale } from '@/i18n/i18n';
import { localizeExercise } from '@/lib/exercises';
import type { Exercise, ExerciseRow } from '@/types/exercises';

/**
 * Retrieves a single exercise and the data needed by the details drawer.
 *
 * The relational select fetches the exercise, its requested translation, and all image records in
 * one database round trip. `maybeSingle()` represents a missing UUID as `null` instead of treating
 * it as a database failure, allowing the route handler to return a meaningful HTTP 404 response.
 */
export async function getExerciseById(
  supabase: SupabaseClient,
  id: string,
  requestedLocale?: string
): Promise<Exercise | null> {
  const locale: Locale = requestedLocale && isLocale(requestedLocale) ? requestedLocale : 'en';
  const { data, error } = await supabase
    .from('exercises')
    .select(
      'id,name,category,description,exercise_translations(locale,name,description),exercise_images(image_path,sort_order)'
    )
    .eq('id', id)
    .eq('exercise_translations.locale', locale)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? localizeExercise(data as unknown as ExerciseRow, locale) : null;
}
