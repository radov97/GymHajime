import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import TabSelector from '../components/TabSelector';

const options = [
  { value: 'explore', label: 'Explore Exercises' },
  { value: 'mine', label: 'My Exercises' },
  { value: 'builder', label: 'Workout Builder' },
];

const meta = {
  title: 'Components/TabSelector',
  component: TabSelector,
  decorators: [
    (Story) => (
      <div className="bg-[var(--color-brand-soft)] p-6">
        <Story />
      </div>
    ),
  ],
  args: {
    value: 'explore',
    options,
    onChange: fn(),
    ariaLabel: 'Exercise sections',
  },
} satisfies Meta<typeof TabSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ExploreSelected: Story = {};
export const MyExercisesSelected: Story = { args: { value: 'mine' } };
export const BuilderSelected: Story = { args: { value: 'builder' } };
export const Interactive: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('tab', { name: 'My Exercises' }));
    await expect(args.onChange).toHaveBeenCalledWith('mine');
  },
};
