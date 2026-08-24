import type { Exercise } from './exercises';

/** Exercise catalogue data combined with a user's configuration for one workout row. */
export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  name: string;
  category: string;
  imageUrl: string | null;
  sets: number | null;
  reps: number | null;
  weight: number | null;
  durationMinutes: number | null;
  sortOrder: number;
  /** Complete localized catalogue record used by the workout details drawer. */
  details?: Exercise;
}

/** Client-facing representation of the authenticated user's workout for one weekday. */
export interface Workout {
  id: string;
  dayOfWeek: number;
  name: string | null;
  exercises: WorkoutExercise[];
}

/** Shared HTTP envelope; `null` means the selected day has not been configured yet. */
export interface WorkoutResponse {
  workout: Workout | null;
}

/** All configured weekday workouts; omitted weekdays are intentional rest days. */
export interface WeeklyWorkoutsResponse {
  workouts: Workout[];
}

/** Writable fields for one exercise in an explicitly saved workout draft. */
export interface SaveWorkoutExerciseInput {
  exerciseId: string;
  sets: number | null;
  reps: number | null;
  weight: number | null;
  durationMinutes: number | null;
  sortOrder: number;
}

/** Complete replacement draft sent when the user presses Save Workout. */
export interface SaveWorkoutInput {
  name: string | null;
  exercises: SaveWorkoutExerciseInput[];
}
