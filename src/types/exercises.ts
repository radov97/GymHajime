/**
 * Shared exercise domain and HTTP response contracts.
 *
 * Both the backend services/routes and frontend API clients import these types. Keeping the
 * contracts independent from React and Supabase query builders makes the HTTP API usable by a
 * future web, React Native, or other standards-based client.
 */
export interface ExerciseTranslation {
  locale: string;
  name: string;
  description: string | null;
}

export interface ExerciseImage {
  image_path: string;
  sort_order: number;
}

export interface ExerciseRow {
  id: string;
  name: string;
  category: string;
  description: string | null;
  exercise_translations: ExerciseTranslation[];
  exercise_images: ExerciseImage[];
}

export interface Exercise extends Omit<ExerciseRow, 'exercise_translations' | 'exercise_images'> {
  images: Array<ExerciseImage & { url: string }>;
}

export interface GetExercisesParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  locale?: string;
}

export interface ExercisesResponse {
  exercises: Exercise[];
  categories: string[];
  total: number;
  page: number;
  limit: number;
}

export interface SavedExercisesResponse {
  exercises: Exercise[];
}

export interface SavedExerciseMutationResponse {
  exerciseId: string;
}

export interface ApiErrorResponse {
  error: string;
}
