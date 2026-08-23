import { authenticatedHeaders } from './auth';
import type { SaveWorkoutInput, WorkoutResponse } from '@/types/workouts';

/**
 * Executes an authenticated workout request and converts unsuccessful responses into useful
 * errors. Components use this boundary without knowing how browser sessions or headers work.
 */
async function request(url: string, init?: RequestInit): Promise<WorkoutResponse> {
  const response = await fetch(url, {
    ...init,
    headers: { ...(await authenticatedHeaders(Boolean(init?.body))), ...init?.headers },
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? 'Request failed');
  }
  return response.json() as Promise<WorkoutResponse>;
}

/** Loads the authenticated user's localized workout configuration for one weekday. */
export function getWorkout(day: number, locale: string): Promise<WorkoutResponse> {
  return request(`/api/workouts?day=${day}&locale=${encodeURIComponent(locale)}`);
}

/** Persists a complete weekday draft in one HTTP request. */
export function saveWorkout(
  day: number,
  locale: string,
  workout: SaveWorkoutInput
): Promise<WorkoutResponse> {
  return request(`/api/workouts/${day}?locale=${encodeURIComponent(locale)}`, {
    method: 'PUT',
    body: JSON.stringify(workout),
  });
}
