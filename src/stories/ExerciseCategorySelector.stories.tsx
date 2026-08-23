import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import ExerciseCategorySelector from '../components/exercises/ExerciseCategorySelector';

const meta = {
  title: 'Exercises/ExerciseCategorySelector',
  component: ExerciseCategorySelector,
  args: {
    value: '',
    categories: ['arms', 'back', 'cardio', 'chest', 'core', 'legs', 'shoulders'],
    onChange: fn(),
    getCategoryLabel: (value) => value.charAt(0).toUpperCase() + value.slice(1),
    allLabel: 'All',
    ariaLabel: 'Exercise category',
  },
  decorators: [
    (Story) => (
      <div className="bg-[var(--color-brand-soft)] p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ExerciseCategorySelector>;
export default meta;
type Story = StoryObj<typeof meta>;
export const AllCategories: Story = {};
export const ChestSelected: Story = { args: { value: 'chest' } };
