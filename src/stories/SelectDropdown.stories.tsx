import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import SelectDropdown from '../components/SelectDropdown';

const weekdayOptions = [
  { value: '1', label: 'Monday' },
  { value: '2', label: 'Tuesday' },
  { value: '3', label: 'Wednesday' },
  { value: '4', label: 'Thursday' },
  { value: '5', label: 'Friday' },
];

const meta = {
  title: 'Components/SelectDropdown',
  component: SelectDropdown,
  decorators: [
    (Story) => (
      <div className="w-64 bg-[var(--color-brand-soft)] p-6">
        <Story />
      </div>
    ),
  ],
  args: {
    value: '1',
    onChange: fn(),
    options: weekdayOptions,
    ariaLabel: 'Day',
    label: 'Day',
  },
} satisfies Meta<typeof SelectDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutVisibleLabel: Story = {
  args: { label: undefined },
};

export const Selected: Story = {
  args: { value: '3' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Interactive: Story = {
  play: async ({ canvasElement, args }) => {
    const select = within(canvasElement).getByRole('combobox', { name: 'Day' });
    await userEvent.selectOptions(select, '2');
    await expect(args.onChange).toHaveBeenCalledWith('2');
  },
};
