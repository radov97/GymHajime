import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ExercisesPage from '../components/exercises/ExercisesPage';

const meta = {
  title: 'Exercises/ExercisesPage',
  component: ExercisesPage,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ExercisesPage>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
