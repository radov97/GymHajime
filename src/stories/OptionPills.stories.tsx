import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import OptionPills from '../components/OptionPills';

const options = [
  { value: '', label: 'All' },
  { value: 'arms', label: 'Arms' },
  { value: 'back', label: 'Back' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'chest', label: 'Chest' },
  { value: 'core', label: 'Core' },
  { value: 'legs', label: 'Legs' },
  { value: 'shoulders', label: 'Shoulders' },
];

const meta = {
  title: 'Components/OptionPills',
  component: OptionPills,
  decorators: [
    (Story) => (
      <div className="bg-[var(--color-brand-soft)] p-6">
        <Story />
      </div>
    ),
  ],
  args: {
    value: '',
    options,
    onChange: fn(),
    ariaLabel: 'Exercise category',
  },
} satisfies Meta<typeof OptionPills>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Selected: Story = { args: { value: 'chest' } };
export const WithDisabledOption: Story = {
  args: { options: options.map((option) => ({ ...option, disabled: option.value === 'cardio' })) },
};
export const Interactive: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Chest' }));
    await expect(args.onChange).toHaveBeenCalledWith('chest');
  },
};
