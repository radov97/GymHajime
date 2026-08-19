import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import NavLink from '../components/NavLink';

const meta = {
  title: 'NavLink',
  component: NavLink,
  decorators: [
    (Story) => (
      <div className="inline-block rounded-lg bg-[var(--color-brand-dark)] p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NavLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { text: 'Login', href: '/en/login' },
};

export const Signup: Story = {
  args: { text: 'Create account', href: '/en/signup' },
};

export const LocalizedLabel: Story = {
  args: { text: 'Înregistrează-te', href: '/ro/signup' },
};

export const LongLabel: Story = {
  args: { text: 'View your personalised training plan', href: '/en' },
};
