import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import SavedExercisePicker from '../components/exercises/SavedExercisePicker';
import { exerciseFixture } from '@/dummy/exerciseFixture';

const labels = {
  add: 'Add Exercise',
  close: 'Close picker',
  search: 'Search saved exercises...',
  noMatches: 'No matching saved exercises.',
  noSaved: 'Save exercises in My Exercises before adding them to a workout.',
};
const meta = {
  title: 'Exercises/SavedExercisePicker',
  component: SavedExercisePicker,
  args: {
    open: true,
    exercises: [exerciseFixture],
    hasSavedExercises: true,
    search: '',
    categoryLabel: () => 'Chest',
    labels,
    onSearchChange: fn(),
    onAdd: fn(),
    onClose: fn(),
  },
} satisfies Meta<typeof SavedExercisePicker>;
export default meta;
type Story = StoryObj<typeof meta>;
export const WithExercises: Story = {};
export const NoMatches: Story = { args: { exercises: [], search: 'squat' } };
export const EmptyLibrary: Story = { args: { exercises: [], hasSavedExercises: false } };
