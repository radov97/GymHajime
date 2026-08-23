import supabase from '@/lib/supabaseClient';

/**
 * Creates the Authorization header used by browser API clients.
 * The backend verifies this access token and derives the user identity from it.
 */
export async function authenticatedHeaders(includeJson = false): Promise<HeadersInit> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error('Authentication required');
  return {
    Authorization: `Bearer ${token}`,
    ...(includeJson ? { 'Content-Type': 'application/json' } : {}),
  };
}
