import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Creates a new Supabase client for one server-side request.
 *
 * Unlike the browser singleton, this client does not store or refresh a session. When an access
 * token is supplied, it is attached to every Supabase request. Supabase can then apply its Row
 * Level Security policies as the authenticated user represented by that token. Public endpoints
 * omit the token and operate with the anonymous role.
 */
export function createServerSupabaseClient(accessToken?: string): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new Error('Supabase server configuration is missing');

  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined,
  });
}

/**
 * Extracts a Supabase access token from the standard HTTP Authorization header.
 *
 * API consumers send `Authorization: Bearer <token>`. This helper deliberately returns
 * `undefined` for missing or non-Bearer headers so protected route handlers can respond with 401.
 */
export function bearerToken(request: Request): string | undefined {
  const authorization = request.headers.get('authorization');
  return authorization?.startsWith('Bearer ') ? authorization.slice(7) : undefined;
}
