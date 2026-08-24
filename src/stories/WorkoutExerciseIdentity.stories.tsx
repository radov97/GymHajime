import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import WorkoutExerciseIdentity from '@/components/exercises/WorkoutExerciseIdentity';

const meta = {
  title: 'Exercises/WorkoutExerciseIdentity',
  component: WorkoutExerciseIdentity,
  decorators: [
    (Story) => (
      <div className="max-w-xl p-6">
        <Story />
      </div>
    ),
  ],
  args: {
    exercise: {
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
    categoryLabel: 'Chest',
    onClick: () => undefined,
    className: 'border border-orange-100 bg-white p-4 shadow-sm',
    trailing: (
      <span className="rounded-full bg-orange-50 px-3 py-2 text-sm font-bold text-orange-700">
        4 × 8
      </span>
    ),
  },
} satisfies Meta<typeof WorkoutExerciseIdentity>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithoutPrescription: Story = { args: { trailing: undefined } };
