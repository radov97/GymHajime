import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Button from '../components/Button';
import { ButtonRank, ButtonType } from '@/lib/enums';

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
export const Link: Story = {
  args: { text: 'Redirect me to ...', rank: ButtonRank.Link, type: ButtonType.Button },
};
export const Loading: Story = {
  args: { text: 'Loading...', rank: ButtonRank.Primary, loading: true },
};
export const Disabled: Story = {
  args: { text: 'Disabled', rank: ButtonRank.Secondary, disabled: true },
};
