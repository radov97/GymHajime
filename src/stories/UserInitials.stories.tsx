import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import UserInitials from '@/components/UserInitials';

const meta = {
  title: 'Navigation/UserInitials',
  component: UserInitials,
  decorators: [
    (Story) => (
      <div className="inline-flex bg-[var(--color-brand)] p-6">
        <Story />
      </div>
    ),
  ],
  args: { name: 'Andrei Iulian Radovici' },
} satisfies Meta<typeof UserInitials>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThreeInitials: Story = {};
export const TwoInitials: Story = { args: { name: 'Andrei Radovici' } };
export const EmailFallback: Story = { args: { name: 'andrei@example.com' } };
