import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import LanguageSelector from '../components/LanguageSelector';

const meta = {
  title: 'Navigation/LanguageSelector',
  component: LanguageSelector,
  decorators: [
    (Story) => (
      <div className="flex min-h-72 justify-end bg-[var(--color-brand)] p-6 text-white">
        <Story />
      </div>
    ),
  ],
  parameters: {
    nextjs: { navigation: { pathname: '/en/daily-training' } },
  },
} satisfies Meta<typeof LanguageSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const English: Story = {};

export const MenuOpen: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /Current language: English/ }));
    await expect(canvas.getAllByRole('menuitem')).toHaveLength(7);
    await expect(canvas.getByRole('menuitem', { name: 'English' })).toBeDisabled();
  },
};

export const Romanian: Story = {
  globals: { locale: 'ro' },
  parameters: { nextjs: { navigation: { pathname: '/ro/daily-training' } } },
};
