import type { SupabaseClient } from '@supabase/supabase-js';
import { isLocale, type Locale } from '@/i18n/i18n';
import { localizeExercise } from '@/lib/exercises';
import type { ExerciseRow, ExercisesResponse, GetExercisesParams } from '@/types/exercises';

/**
 * Retrieves one filtered page of the global exercise catalogue.
 *
 * The service receives a Supabase client from the HTTP layer, keeping database knowledge out of
 * React and route handlers. It joins translations and images in the catalogue query, so it avoids
 * making a separate query for every exercise. `!inner` makes the locale/search constraints filter
 * the exercises themselves rather than only filtering the nested translation array.
 *
 * Pagination is converted from the API's one-based page number into Supabase's inclusive row
 * range. A small category-only query runs in parallel so the UI can display every database-backed
 * filter even when the current page does not contain every category.
 */
export async function getExercises(
  supabase: SupabaseClient,
  params: Required<Pick<GetExercisesParams, 'page' | 'limit'>> & GetExercisesParams
): Promise<ExercisesResponse> {
  const locale: Locale = params.locale && isLocale(params.locale) ? params.locale : 'en';
  const from = (params.page - 1) * params.limit;
  let query = supabase
    .from('exercises')
    .select(
      'id,name,category,description,exercise_translations!inner(locale,name,description),exercise_images(image_path,sort_order)',
      { count: 'exact' }
    )
    .eq('exercise_translations.locale', locale)
    .order('name')
    .range(from, from + params.limit - 1);
  if (params.category) query = query.eq('category', params.category);
  if (params.search) {
    const escaped = params.search.replaceAll('%', '\\%').replaceAll('_', '\\_');
    query = query.ilike('exercise_translations.name', `%${escaped}%`);
  }

  const [catalogue, categoryResult] = await Promise.all([
    query,
    supabase.from('exercises').select('category'),
  ]);
  if (catalogue.error) throw new Error(catalogue.error.message);
  if (categoryResult.error) throw new Error(categoryResult.error.message);

  return {
    exercises: (catalogue.data as unknown as ExerciseRow[]).map((row) =>
      localizeExercise(row, locale)
    ),
    categories: [...new Set(categoryResult.data.map((row) => String(row.category)))].sort(),
    total: catalogue.count ?? 0,
    page: params.page,
    limit: params.limit,
  };
}
