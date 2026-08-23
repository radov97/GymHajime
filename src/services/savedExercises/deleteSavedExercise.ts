import type { SupabaseClient } from '@supabase/supabase-js';
import type { SavedExerciseMutationResponse } from '@/types/exercises';

/**
 * Removes one exercise from the authenticated user's saved library.
 *
 * Both `user_id` and `exercise_id` are included in the delete conditions. This prevents the
 * operation from targeting another user's row even before Row Level Security is considered.
 * Deleting a row that is already absent remains safe and idempotent from the API consumer's view.
 */
export async function deleteSavedExercise(
  supabase: SupabaseClient,
  userId: string,
  exerciseId: string
): Promise<SavedExerciseMutationResponse> {
  const { error } = await supabase
    .from('saved_exercises')
    .delete()
    .eq('user_id', userId)
    .eq('exercise_id', exerciseId);
  if (error) throw new Error(error.message);
  return { exerciseId };
}
