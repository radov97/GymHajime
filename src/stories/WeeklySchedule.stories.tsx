import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import WeeklySchedule from '../components/schedule/WeeklySchedule';
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
  {
    id: 'wednesday',
    dayOfWeek: 3,
    name: 'Cardio',
    exercises: [
      {
        id: 'run-row',
        exerciseId: 'run',
        name: 'Treadmill Run',
        category: 'cardio',
        imageUrl: null,
        sets: null,
        reps: null,
        weight: null,
        durationMinutes: 30,
        sortOrder: 1,
      },
    ],
  },
  {
    id: 'friday',
    dayOfWeek: 5,
    name: 'Leg Day',
    exercises: [
      {
        id: 'squat-row',
        exerciseId: 'squat',
        name: 'Barbell Squat',
        category: 'legs',
        imageUrl: null,
        sets: 5,
        reps: 5,
        weight: 80,
        durationMinutes: null,
        sortOrder: 1,
      },
    ],
  },
];

const meta = {
  title: 'Schedule/WeeklySchedule',
  component: WeeklySchedule,
  parameters: { layout: 'fullscreen' },
  args: { loadSchedule: async () => ({ workouts }) },
} satisfies Meta<typeof WeeklySchedule>;

export default meta;
type Story = StoryObj<typeof meta>;
export const DesktopWeek: Story = {};
export const MobileAgenda: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
export const AllRestDays: Story = { args: { loadSchedule: async () => ({ workouts: [] }) } };
