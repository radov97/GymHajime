import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import ExerciseCard from '../components/exercises/ExerciseCard';
import { exerciseFixture } from '@/dummy/exerciseFixture';

const meta = {
  title: 'Exercises/ExerciseCard',
  component: ExerciseCard,
  args: {
    exercise: exerciseFixture,
    saved: false,
    saving: false,
    onOpen: fn(),
    onToggleSave: fn(),
    saveLabel: 'Save exercise',
    removeLabel: 'Remove saved exercise',
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ExerciseCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Saved: Story = { args: { saved: true } };
export const Saving: Story = { args: { saving: true } };
export const Interactive: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Save exercise' }));
    await expect(args.onToggleSave).toHaveBeenCalled();
  },
};
