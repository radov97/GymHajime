import type { SupabaseClient } from '@supabase/supabase-js';
import { isLocale, type Locale } from '@/i18n/i18n';
import { localizeExercise } from '@/lib/exercises';
import type { ExerciseRow, ExercisesResponse, GetExercisesParams } from '@/types/exercises';

const SEARCH_STOP_WORDS: Record<Locale, ReadonlySet<string>> = {
  en: new Set([
    'a',
    'an',
    'the',
    'for',
    'with',
    'using',
    'exercise',
    'exercises',
    'workout',
    'workouts',
  ]),
  de: new Set([
    'der',
    'die',
    'das',
    'ein',
    'eine',
    'für',
    'fur',
    'mit',
    'übung',
    'ubung',
    'übungen',
    'ubungen',
  ]),
  es: new Set([
    'el',
    'la',
    'los',
    'las',
    'un',
    'una',
    'de',
    'para',
    'con',
    'ejercicio',
    'ejercicios',
  ]),
  fr: new Set([
    'le',
    'la',
    'les',
    'un',
    'une',
    'de',
    'des',
    'pour',
    'avec',
    'exercice',
    'exercices',
  ]),
  it: new Set([
    'il',
    'lo',
    'la',
    'i',
    'gli',
    'le',
    'un',
    'una',
    'per',
    'con',
    'esercizio',
    'esercizi',
  ]),
  ro: new Set([
    'un',
    'o',
    'de',
    'cu',
    'pentru',
    'antrenament',
    'antrenamente',
    'exercițiu',
    'exercitiu',
    'exerciții',
    'exercitii',
  ]),
  tl: new Set(['ang', 'isang', 'ng', 'sa', 'para', 'mga', 'ehersisyo']),
};

/** Category words accepted from any supported language, normalized without diacritics. */
const CATEGORY_ALIASES: Record<string, string> = {
  arm: 'arms',
  arms: 'arms',
  arme: 'arms',
  brate: 'arms',
  brazos: 'arms',
  bras: 'arms',
  braccia: 'arms',
  braso: 'arms',
  back: 'back',
  spate: 'back',
  espalda: 'back',
  dos: 'back',
  schiena: 'back',
  rucken: 'back',
  likod: 'back',
  cardio: 'cardio',
  cardiovascular: 'cardio',
  endurance: 'cardio',
  ausdauer: 'cardio',
  chest: 'chest',
  piept: 'chest',
  pecho: 'chest',
  pectoral: 'chest',
  pectoraux: 'chest',
  petto: 'chest',
  brust: 'chest',
  dibdib: 'chest',
  core: 'core',
  abdomen: 'core',
  abdominal: 'core',
  abdominals: 'core',
  abdominaux: 'core',
  rumpf: 'core',
  tiyan: 'core',
  leg: 'legs',
  legs: 'legs',
  picioare: 'legs',
  piernas: 'legs',
  jambes: 'legs',
  gambe: 'legs',
  beine: 'legs',
  binti: 'legs',
  shoulder: 'shoulders',
  shoulders: 'shoulders',
  umeri: 'shoulders',
  hombros: 'shoulders',
  epaules: 'shoulders',
  spalle: 'shoulders',
  schultern: 'shoulders',
  balikat: 'shoulders',
};

/** Converts user text to lowercase words with diacritics removed for intent comparison. */
function normalizedTokens(search: string, locale: Locale): string[] {
  return (
    search
      .toLocaleLowerCase(locale)
      .normalize('NFD')
      .replace(/\p{M}/gu, '')
      .match(/[\p{L}\p{N}]+/gu) ?? []
  );
}

/**
 * Detects a known category anywhere in natural-language syntax. Surrounding connector words are
 * irrelevant, so `Antrenament piept` and `exercitii pentru piept` both resolve to `chest`.
 */
export function detectCategoryIntent(search: string, locale: Locale): string | undefined {
  return normalizedTokens(search, locale)
    .map((token) => CATEGORY_ALIASES[token])
    .find((category) => category !== undefined);
}

/**
 * Reduces a natural-language search to meaningful name terms.
 *
 * Punctuation is ignored, common locale-specific filler words are removed, duplicates are
 * discarded, and the number of database filters is capped. If a query consists entirely of filler
 * words, the original tokens are retained so the search still behaves predictably.
 */
export function meaningfulSearchTerms(search: string, locale: Locale): string[] {
  const tokens = normalizedTokens(search, locale);
  const normalizedStopWords = new Set(
    [...SEARCH_STOP_WORDS[locale]].map((word) => normalizedTokens(word, locale)[0])
  );
  const meaningful = tokens.filter((token) => !normalizedStopWords.has(token));
  return [...new Set(meaningful.length > 0 ? meaningful : tokens)].slice(0, 8);
}

/**
 * Retrieves one filtered page of the global exercise catalogue.
 *
 * The service receives a Supabase client from the HTTP layer, keeping database knowledge out of
 * React and route handlers. It joins translations and images in the catalogue query, so it avoids
 * making a separate query for every exercise. English lives in the base `exercises` columns, while
 * other locales live in `exercise_translations`; the query selects and searches the appropriate
 * source for the requested locale.
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
  const intendedCategory = params.search ? detectCategoryIntent(params.search, locale) : undefined;
  const translationsRelation =
    locale === 'en'
      ? 'exercise_translations(locale,name,description)'
      : 'exercise_translations!inner(locale,name,description)';
  let query = supabase
    .from('exercises')
    .select(
      `id,name,category,description,${translationsRelation},exercise_images(image_path,sort_order)`,
      { count: 'exact' }
    )
    .eq('exercise_translations.locale', locale)
    .order('name')
    .range(from, from + params.limit - 1);
  const effectiveCategory = params.category || intendedCategory;
  if (effectiveCategory) query = query.eq('category', effectiveCategory);
  if (params.search && !intendedCategory) {
    const searchColumn = locale === 'en' ? 'name' : 'exercise_translations.name';
    for (const term of meaningfulSearchTerms(params.search, locale)) {
      // Chained filters use AND semantics: every meaningful word must occur, but word order does
      // not matter. For example, "exercises for smith machine" matches "Smith Machine Bench Press".
      query = query.ilike(searchColumn, `%${term}%`);
    }
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
