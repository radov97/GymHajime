import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Button from '../components/Button';
import { ButtonRank, ButtonType } from '../lib/enums';

const meta = {
  title: 'Button',
  component: Button,
  argTypes: {
    text: { control: 'text', description: 'Button label text' },
    type: { control: 'select', options: Object.values(ButtonType) },
    rank: { control: 'select', options: Object.values(ButtonRank) },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { text: 'Submit', rank: ButtonRank.Primary, type: ButtonType.Submit },
};
export const Secondary: Story = {
  args: { text: 'Cancel', rank: ButtonRank.Secondary, type: ButtonType.Button },
};
export const Danger: Story = {
  args: { text: 'Delete workout', rank: ButtonRank.Danger, type: ButtonType.Button },
};
export const Link: Story = {
  args: { text: 'Redirect me to ...', rank: ButtonRank.Link, type: ButtonType.Button },
};
export const Loading: Story = {
  args: { text: 'Loading...', rank: ButtonRank.Primary, loading: true },
};
export const Disabled: Story = {
  args: { text: 'Disabled', rank: ButtonRank.Secondary, disabled: true },
};

export const LongLabel: Story = {
  args: {
    text: 'Save this personalised workout routine',
    rank: ButtonRank.Primary,
  },
};

export const CustomWidth: Story = {
  args: {
    text: 'Add set',
    rank: ButtonRank.Secondary,
    className: 'w-auto px-8',
  },
};

export const ResetFormButton: Story = {
  args: { text: 'Reset form', rank: ButtonRank.Link, type: ButtonType.Reset },
};
