import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Header from '../components/Header';

const meta = {
  title: 'Navigation/Header',
  component: Header,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const English: Story = {};

export const Romanian: Story = {
  globals: { locale: 'ro' },
};

export const German: Story = {
  globals: { locale: 'de' },
};
