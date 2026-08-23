import type { Exercise, ExercisesResponse, GetExercisesParams } from '@/types/exercises';

/**
 * Converts a Fetch response into typed JSON or a useful application error.
 * This keeps repeated HTTP status handling out of individual frontend API functions.
 */
async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? 'Request failed');
  }
  return response.json() as Promise<T>;
}

/**
 * Calls the catalogue HTTP endpoint with optional search, filter, locale, and pagination values.
 * React components use this function instead of knowing URL formats or database query details.
 */
export async function getExercises(params: GetExercisesParams): Promise<ExercisesResponse> {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') query.set(key, String(value));
  });
  return parseResponse<ExercisesResponse>(await fetch(`/api/exercises?${query}`));
}

/**
 * Calls the exercise-details endpoint for a UUID and optional display locale.
 * URL encoding prevents special characters from changing the intended request path or query.
 */
export async function getExerciseById(id: string, locale?: string): Promise<Exercise> {
  const query = locale ? `?locale=${encodeURIComponent(locale)}` : '';
  return parseResponse<Exercise>(await fetch(`/api/exercises/${encodeURIComponent(id)}${query}`));
}
