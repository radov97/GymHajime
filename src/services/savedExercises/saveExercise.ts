import type { SupabaseClient } from '@supabase/supabase-js';
import type { SavedExerciseMutationResponse } from '@/types/exercises';

/**
 * Saves an exercise for the authenticated user.
 *
 * `upsert` uses the table's `(user_id, exercise_id)` unique constraint as its conflict target. If
 * two identical requests arrive, the second request does not create a duplicate. The caller gets
 * the exercise ID back so HTTP and native clients can update their local state consistently.
 */
export async function saveExercise(
  supabase: SupabaseClient,
  userId: string,
  exerciseId: string
): Promise<SavedExerciseMutationResponse> {
  const { error } = await supabase
    .from('saved_exercises')
    .upsert({ user_id: userId, exercise_id: exerciseId }, { onConflict: 'user_id,exercise_id' });
  if (error) throw new Error(error.message);
  return { exerciseId };
}
