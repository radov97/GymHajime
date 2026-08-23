import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import WorkoutExerciseTable from '../components/exercises/WorkoutExerciseTable';
import type { WorkoutExercise } from '@/types/workouts';

const exercises: WorkoutExercise[] = [
  {
    id: '1',
    exerciseId: 'bench',
    name: 'Barbell Bench Press',
    category: 'chest',
    imageUrl: '/gymhajime-logo.png',
    sets: 4,
    reps: 8,
    weight: 60,
    sortOrder: 1,
  },
  {
    id: '2',
    exerciseId: 'incline',
    name: 'Incline Dumbbell Press',
    category: 'chest',
    imageUrl: null,
    sets: 3,
    reps: 10,
    weight: 22.5,
    sortOrder: 2,
  },
];
const labels = {
  exercise: 'Exercise',
  sets: 'Sets',
  reps: 'Reps',
  weight: 'Weight (kg)',
  actions: 'Actions',
  up: 'Move up',
  down: 'Move down',
  remove: 'Remove',
};

const meta = {
  title: 'Exercises/WorkoutExerciseTable',
  component: WorkoutExerciseTable,
  decorators: [
    (Story) => (
      <div className="min-w-[900px] bg-[var(--color-brand-soft)] p-8">
        <Story />
      </div>
    ),
  ],
  args: {
    exercises,
    categoryLabel: () => 'Chest',
    labels,
    onUpdate: fn(),
    onMove: fn(),
    onRemove: fn(),
  },
} satisfies Meta<typeof WorkoutExerciseTable>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Configured: Story = {};
export const SingleExercise: Story = { args: { exercises: exercises.slice(0, 1) } };
