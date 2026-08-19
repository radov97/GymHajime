import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import DropdownMenu from '../components/DropdownMenu';

const meta = {
  title: 'Navigation/DropdownMenu',
  component: DropdownMenu,
  decorators: [
    (Story) => (
      <div className="relative flex min-h-48 justify-end bg-[var(--color-brand)] p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleOption: Story = {
  args: {
    isOpen: true,
    options: [{ id: 'logout', label: 'Logout', onClick: fn() }],
  },
  play: async ({ canvasElement, args }) => {
    const option = within(canvasElement).getByRole('menuitem', { name: 'Logout' });
    await userEvent.click(option);
    await expect(args.options[0].onClick).toHaveBeenCalledOnce();
  },
};

export const MultipleOptions: Story = {
  args: {
    isOpen: true,
    options: [
      { id: 'profile', label: 'Profile', onClick: fn() },
      { id: 'settings', label: 'Settings', onClick: fn() },
      { id: 'logout', label: 'Logout', onClick: fn() },
    ],
  },
};

export const DisabledOption: Story = {
  args: {
    isOpen: true,
    options: [{ id: 'unavailable', label: 'Unavailable', onClick: fn(), disabled: true }],
  },
};

export const Closed: Story = {
  args: { isOpen: false, options: [] },
};
