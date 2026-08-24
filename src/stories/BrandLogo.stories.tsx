import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { BrandLogoView } from '../components/BrandLogo';

const meta = {
  title: 'Brand/BrandLogo',
  component: BrandLogoView,
  args: {
    width: 120,
    height: 120,
    priority: true,
    className: 'h-24 w-auto rounded-md bg-[var(--color-brand-light)] shadow-lg',
    locale: 'en',
  },
} satisfies Meta<typeof BrandLogoView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SignedOut: Story = {
  args: { isAuthenticated: false },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('link')).not.toBeInTheDocument();
  },
};

export const SignedIn: Story = {
  args: { isAuthenticated: true },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('link', { name: 'Go to Daily Training' })
    ).toHaveAttribute('href', '/en/daily-training');
  },
};

export const RomanianDailyTraining: Story = {
  args: { isAuthenticated: true, locale: 'ro' },
};

export const CurrentDailyTraining: Story = {
  args: { isAuthenticated: true, isCurrentDailyTraining: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('link')).not.toBeInTheDocument();
  },
};
