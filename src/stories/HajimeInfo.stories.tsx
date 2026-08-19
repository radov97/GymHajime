import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import HajimeInfo from '../components/HajimeInfo';

const meta = {
  title: 'Navigation/HajimeInfo',
  component: HajimeInfo,
  decorators: [
    (Story) => (
      <div className="min-h-32 bg-[var(--color-brand)] p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof HajimeInfo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {};

export const Open: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'What is Hajime?' }));
    await expect(canvas.getByRole('heading', { name: '始め' })).toBeVisible();
    await expect(canvas.getByText('HAJIME — BEGIN')).toBeVisible();
  },
};

export const Romanian: Story = {
  globals: { locale: 'ro' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Ce înseamnă Hajime?' }));
    await expect(canvas.getByText('HAJIME — ÎNCEPE')).toBeVisible();
    await expect(canvas.getByRole('heading', { name: 'PLANIFICĂ' })).toBeVisible();
  },
};
