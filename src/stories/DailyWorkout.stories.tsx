import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import DailyWorkout from '@/components/daily-training/DailyWorkout';
import type { Workout } from '@/types/workouts';

const workouts: Workout[] = [
  {
    id: 'monday',
    dayOfWeek: 1,
    name: 'Push Day',
    exercises: [
      {
        id: 'bench-row',
        exerciseId: 'bench',
        name: 'Barbell Bench Press',
        category: 'chest',
        imageUrl: null,
        sets: 4,
        reps: 8,
        weight: 60,
        durationMinutes: null,
        sortOrder: 1,
      },
      {
        id: 'press-row',
        exerciseId: 'press',
        name: 'Shoulder Press',
        category: 'shoulders',
        imageUrl: null,
        sets: 3,
        reps: 10,
        weight: 25,
        durationMinutes: null,
        sortOrder: 2,
      },
    ],
  },
];

const meta = {
  title: 'Daily Training/DailyWorkout',
  component: DailyWorkout,
  parameters: { layout: 'fullscreen' },
  args: {
    today: new Date('2026-08-24T12:00:00'),
    loadSchedule: async () => ({ workouts }),
  },
} satisfies Meta<typeof DailyWorkout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TrainingDay: Story = {};
export const RestDay: Story = {
  args: { loadSchedule: async () => ({ workouts: [] }) },
};
