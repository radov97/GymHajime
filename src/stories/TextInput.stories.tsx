import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Search } from 'lucide-react';
import { expect, fn, userEvent, within } from 'storybook/test';
import TextInput from '../components/TextInput';

const meta = {
  title: 'Components/TextInput',
  component: TextInput,
  decorators: [
    (Story) => (
      <div className="w-80 bg-[var(--color-brand-soft)] p-6">
        <Story />
      </div>
    ),
  ],
  args: {
    value: '',
    onChange: fn(),
    ariaLabel: 'Workout name',
    label: 'Workout name',
    placeholder: 'e.g. Chest',
  },
} satisfies Meta<typeof TextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Labelled: Story = {};

export const SearchField: Story = {
  args: {
    value: 'bench',
    type: 'search',
    label: undefined,
    ariaLabel: 'Search exercises',
    placeholder: 'Search exercises...',
    leadingIcon: <Search className="h-5 w-5" />,
    onClear: fn(),
    clearLabel: 'Clear search',
  },
};

export const Disabled: Story = {
  args: { value: 'Chest', disabled: true },
};

export const Interactive: Story = {
  play: async ({ canvasElement, args }) => {
    const input = within(canvasElement).getByRole('textbox', { name: 'Workout name' });
    await userEvent.type(input, 'Chest');
    await expect(args.onChange).toHaveBeenCalled();
  },
};
