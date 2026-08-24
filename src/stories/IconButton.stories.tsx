import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ArrowRightLeft, Plus, Trash2 } from 'lucide-react';
import { expect, fn, userEvent, within } from 'storybook/test';
import IconButton from '../components/IconButton';

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  decorators: [
    (Story) => (
      <div className="flex bg-[var(--color-brand-soft)] p-6">
        <Story />
      </div>
    ),
  ],
  args: { icon: <Plus className="h-5 w-5" />, label: 'Add Exercise', onClick: fn() },
} satisfies Meta<typeof IconButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Outline: Story = {
  args: { icon: <ArrowRightLeft className="h-5 w-5" />, label: 'Move Workout', variant: 'outline' },
};
export const Danger: Story = {
  args: { icon: <Trash2 className="h-5 w-5" />, label: 'Clear Day', variant: 'danger' },
};
export const IconOnly: Story = {
  args: { label: 'Add Exercise', variant: 'ghost', iconOnly: true },
};
export const Disabled: Story = { args: { disabled: true } };
export const Interactive: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Add Exercise' }));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};
