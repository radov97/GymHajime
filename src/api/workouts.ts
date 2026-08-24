import { authenticatedHeaders } from './auth';
import type { SaveWorkoutInput, WeeklyWorkoutsResponse, WorkoutResponse } from '@/types/workouts';

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

/** Loads the complete localized Monday-to-Sunday schedule in one request. */
export async function getWeeklySchedule(locale: string): Promise<WeeklyWorkoutsResponse> {
  const response = await fetch(`/api/workouts?locale=${encodeURIComponent(locale)}`, {
    headers: await authenticatedHeaders(false),
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? 'Unable to load schedule');
  }
  return response.json() as Promise<WeeklyWorkoutsResponse>;
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

/** Deletes the authenticated user's complete workout configuration for one weekday. */
export function clearWorkout(day: number): Promise<WorkoutResponse> {
  return request(`/api/workouts/${day}`, { method: 'DELETE' });
}

/** Moves a persisted workout to another weekday, replacing any workout already at the target. */
export function moveWorkout(
  day: number,
  targetDay: number,
  locale: string
): Promise<WorkoutResponse> {
  return request(`/api/workouts/${day}?locale=${encodeURIComponent(locale)}`, {
    method: 'PATCH',
    body: JSON.stringify({ targetDay }),
  });
}
