import type { Locale } from '@/i18n/i18n';
import type { Exercise, ExerciseRow } from '@/types/exercises';

export type { Exercise, ExerciseImage, ExerciseRow, ExerciseTranslation } from '@/types/exercises';

export const EXERCISES_PAGE_SIZE = 24;
export const EXERCISE_IMAGES_BUCKET =
  process.env.NEXT_PUBLIC_EXERCISE_IMAGES_BUCKET ?? 'exercise-images';

export function localizeExercise(row: ExerciseRow, locale: Locale): Exercise {
  const translation = row.exercise_translations.find((item) => item.locale === locale);
  return {
    id: row.id,
    category: row.category,
    name: translation?.name ?? row.name,
    description: translation?.description ?? row.description,
    images: [...row.exercise_images]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((image) => ({
        ...image,
        url: exerciseImageUrl(image.image_path),
      })),
  };
}

export function exerciseImageUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const encodedPath = path.split('/').map(encodeURIComponent).join('/');
  return `${baseUrl}/storage/v1/object/public/${encodeURIComponent(EXERCISE_IMAGES_BUCKET)}/${encodedPath}`;
}

export function formatCategory(category: string): string {
  return category.replaceAll('_', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}
