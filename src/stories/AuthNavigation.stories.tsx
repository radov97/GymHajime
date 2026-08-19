import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { AuthNavigationView } from '../components/AuthNavigation';

const meta = {
  title: 'Navigation/AuthNavigation',
  component: AuthNavigationView,
  decorators: [
    (Story) => (
      <div className="flex min-h-32 justify-end bg-[var(--color-brand)] p-6">
        <Story />
      </div>
    ),
  ],
  args: {
    onLogout: fn(),
  },
} satisfies Meta<typeof AuthNavigationView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SignedOut: Story = {
  args: { userName: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('link', { name: 'Login' })).toHaveAttribute('href', '/en/login');
    await expect(canvas.getByRole('link', { name: 'Sign Up' })).toHaveAttribute('href', '/en/signup');
  },
};

export const SignedIn: Story = {
  args: { userName: 'Test Athlete' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Test Athlete')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Account menu' })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  },
};

export const MenuOpen: Story = {
  args: { userName: 'Test Athlete', initiallyOpen: true },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const logout = canvas.getByRole('menuitem', { name: 'Logout' });
    await expect(logout).toBeVisible();
    await userEvent.click(logout);
    await expect(canvas.getByRole('heading', { name: 'Confirm logout' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Log out' }));
    await expect(args.onLogout).toHaveBeenCalledOnce();
  },
};

export const EmailFallback: Story = {
  args: { userName: 'athlete@example.com' },
};

export const Romanian: Story = {
  args: { userName: 'Andrei' },
  globals: { locale: 'ro' },
};

export const LongName: Story = {
  args: { userName: 'Alexandru-Mihai Popescu-Ionescu' },
};
