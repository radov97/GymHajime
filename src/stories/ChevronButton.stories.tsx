import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import ChevronButton from '../components/ChevronButton';

const meta = {
  title: 'Navigation/ChevronButton',
  component: ChevronButton,
  decorators: [
    (Story) => (
      <div className="inline-flex rounded-md bg-[var(--color-brand)] p-4 text-white">
        <Story />
      </div>
    ),
  ],
  args: {
    label: 'Account menu',
    onClick: fn(),
  },
} satisfies Meta<typeof ChevronButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {
  args: { isOpen: false },
  play: async ({ canvasElement, args }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Account menu' });
    await expect(button).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};

export const Open: Story = {
  args: { isOpen: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('button')).toHaveAttribute(
      'aria-expanded',
      'true'
    );
  },
};
