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

export const WithoutBackground: Story = {
  args: {
    noBg: true,
    children: (
      <div className="text-white">
        <h2 className="text-xl font-bold">Transparent container</h2>
        <p>The parent surface remains visible through this container.</p>
      </div>
    ),
  },
};

export const CustomSurface: Story = {
  args: {
    noBg: true,
    className: 'bg-[var(--color-brand-light)] border-2 border-[var(--color-brand)]',
    children: (
      <>
        <h2 className="text-xl font-bold text-[var(--color-brand-ink)]">Today&apos;s workout</h2>
        <p className="mt-2 text-gray-700">Upper body strength · 6 exercises</p>
      </>
    ),
  },
};

export const MinimalContent: Story = {
  args: {
    children: <p className="text-center">Your training journey starts here.</p>,
  },
};
