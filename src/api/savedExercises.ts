import supabase from '@/lib/supabaseClient';
import type { SavedExerciseMutationResponse, SavedExercisesResponse } from '@/types/exercises';

/**
 * Reads the current browser session and creates headers for an authenticated API request.
 * The access token proves the session to Next.js; no user ID is sent because the server derives it
 * after verifying this token with Supabase.
 */
async function authenticatedHeaders(): Promise<HeadersInit> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error('Authentication required');
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

/**
 * Executes an authenticated HTTP request and parses its typed JSON response.
 * Centralizing this behavior ensures every saved-exercise operation attaches authentication and
 * handles non-success status codes consistently.
 */
async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { ...(await authenticatedHeaders()), ...init?.headers },
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? 'Request failed');
  }
  return response.json() as Promise<T>;
}

/** Fetches the complete saved-exercise library for the current authenticated user. */
export function getSavedExercises(locale: string): Promise<SavedExercisesResponse> {
  return request(`/api/saved-exercises?locale=${encodeURIComponent(locale)}`);
}

/** Asks the backend to associate one catalogue exercise with the current user. */
export function saveExercise(exerciseId: string): Promise<SavedExerciseMutationResponse> {
  return request('/api/saved-exercises', { method: 'POST', body: JSON.stringify({ exerciseId }) });
}

/** Asks the backend to remove one catalogue exercise from the current user's library. */
export function deleteSavedExercise(exerciseId: string): Promise<SavedExerciseMutationResponse> {
  return request(`/api/saved-exercises/${encodeURIComponent(exerciseId)}`, { method: 'DELETE' });
}
