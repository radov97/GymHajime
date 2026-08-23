import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getExercises } from '@/services/exercises/getExercises';

const DEFAULT_LIMIT = 24;
const MAX_LIMIT = 100;

/**
 * Handles `GET /api/exercises` requests for the paginated public catalogue.
 *
 * Route handlers form the HTTP boundary: this function converts URL query strings into typed
 * service arguments, rejects invalid pagination with HTTP 400, and translates unexpected service
 * failures into HTTP 500. The database query itself stays in `getExercises`, keeping this handler
 * small and making the service reusable from another backend entry point later.
 *
 * Supported query parameters are `page`, `limit`, `search`, `category`, and `locale`.
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const page = Number(params.get('page') ?? 1);
  const limit = Number(params.get('limit') ?? DEFAULT_LIMIT);
  if (
    !Number.isInteger(page) ||
    page < 1 ||
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > MAX_LIMIT
  ) {
    return NextResponse.json({ error: 'Invalid pagination parameters' }, { status: 400 });
  }
  try {
    const result = await getExercises(createServerSupabaseClient(), {
      page,
      limit,
      search: params.get('search')?.trim() || undefined,
      category: params.get('category')?.trim() || undefined,
      locale: params.get('locale') ?? undefined,
    });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Unable to load exercises' }, { status: 500 });
  }
}
