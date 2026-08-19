import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import GoogleButton from '../components/GoogleButton';

const meta = {
  title: 'GoogleButton',
  component: GoogleButton,
  argTypes: {
    text: { control: 'text' },
    width: { control: 'number' },
    height: { control: 'number' },
  },
  decorators: [
    (Story) => (
      <div className="max-w-xs mx-auto p-4 bg-gray-100 rounded">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof GoogleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { text: 'Sign up with Google', width: 40, height: 40 },
};
export const Disabled: Story = {
  args: { ...Default.args, disabled: true },
};

export const SignInCopy: Story = {
  args: { text: 'Sign in with Google', width: 32, height: 32 },
};

export const CompactIcon: Story = {
  args: { text: 'Continue with Google', width: 24, height: 24 },
};

export const LongLocalizedCopy: Story = {
  args: { text: 'Continuă antrenamentul folosind contul Google', width: 32, height: 32 },
};
