import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import WorkoutDayModal from '../components/schedule/WorkoutDayModal';
import type { Workout } from '@/types/workouts';

const workout: Workout = {
  id: 'monday',
  dayOfWeek: 1,
  name: 'Full Body Training',
  exercises: Array.from({ length: 10 }, (_, index) => {
    const cardio = index === 9;
    return {
      id: `row-${index}`,
      exerciseId: `exercise-${index}`,
      name: cardio ? 'Treadmill Run' : `Strength Exercise ${index + 1}`,
      category: cardio ? 'cardio' : 'chest',
      imageUrl: null,
      sets: cardio ? null : 3,
      reps: cardio ? null : 10,
      weight: cardio ? null : 25,
      durationMinutes: cardio ? 30 : null,
      sortOrder: index + 1,
      details: {
        id: `exercise-${index}`,
        name: cardio ? 'Treadmill Run' : `Strength Exercise ${index + 1}`,
        category: cardio ? 'cardio' : 'chest',
        description: 'Use a controlled tempo and maintain consistent technique throughout.',
        images: [1, 2, 3].map((number) => ({
          image_path: `exercise-${index}-${number}`,
          sort_order: number,
          url: '/gymhajime-logo.png',
        })),
      },
    };
  }),
};

const meta = {
  title: 'Schedule/WorkoutDayModal',
  component: WorkoutDayModal,
  args: { workout, day: 'Monday', onClose: fn() },
} satisfies Meta<typeof WorkoutDayModal>;

export default meta;
type Story = StoryObj<typeof meta>;
export const LongWorkout: Story = {};
