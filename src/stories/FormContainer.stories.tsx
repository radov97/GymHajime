import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import FormContainer from '../components/FormContainer';

const meta = {
  title: 'FormContainer',
  component: FormContainer,
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-[var(--color-brand-dark)] flex items-center justify-center p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FormContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <h2 className="text-xl font-bold text-[var(--color-brand-ink)] mb-4">
          Sign up for GymHajime
        </h2>
        <input
          type="text"
          placeholder="Full Name"
          className="w-full border border-gray-300 rounded p-2 mb-3"
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border border-gray-300 rounded p-2 mb-3"
        />
        <button className="w-full bg-[var(--color-brand)] text-white font-semibold py-2 rounded">
          Create Account
        </button>
      </>
    ),
  },
};
