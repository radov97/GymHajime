import DailyWorkout from '@/components/daily-training/DailyWorkout';

/**
 * Quick view of the user's immediate training schedule.
 * Displays only yesterday, today, and tomorrow.
 * Yesterday shows the planned workout and whether it was completed.
 * Today shows the workout, exercises, and a Start Workout action.
 * Tomorrow previews the next planned workout.
 */
export default function DailyTrainingPage() {
  return <DailyWorkout />;
}
