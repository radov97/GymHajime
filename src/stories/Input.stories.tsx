import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Input, { type InputProps } from '../components/Input';
import { InputType } from '../lib/enums';

const meta = {
  title: 'Input',
  component: Input,
  argTypes: {
    type: { control: 'select', options: Object.values(InputType) },
    placeholder: { control: 'text' },
    error: { control: 'boolean' },
    errorText: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    showToggle: { control: 'boolean' },
    debounceDelay: { control: 'number' },
  },
  render: function Render(args: InputProps) {
    const [value, setValue] = useState(args.value ?? '');

    return (
      <div className="w-full max-w-md mx-auto">
        <Input
          {...args}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onDebouncedChange={(debounced) => console.log('Debounced:', debounced)}
        />
      </div>
    );
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultArgs: InputProps = {
  type: InputType.Text,
  placeholder: 'Your input here',
  error: false,
  errorText: '',
  disabled: false,
  required: false,
  showToggle: false,
  debounceDelay: 300,
};

export const Default: Story = { args: defaultArgs };
export const EmailInput: Story = {
  args: { ...defaultArgs, type: InputType.Email, placeholder: 'Your email' },
};
export const PasswordInput: Story = {
  args: {
    ...defaultArgs,
    type: InputType.Password,
    placeholder: 'Enter your password',
    showToggle: true,
  },
};
export const WithError: Story = {
  args: {
    ...defaultArgs,
    placeholder: 'Error example',
    error: true,
    errorText: 'This field is required.',
  },
};
export const DisabledInput: Story = {
  args: { ...defaultArgs, placeholder: 'Disabled input', disabled: true },
};

export const Populated: Story = {
  args: { ...defaultArgs, value: 'Barbell squat', placeholder: 'Exercise name' },
};

export const Required: Story = {
  args: { ...defaultArgs, placeholder: 'Workout name', required: true },
};

export const PasswordWithoutToggle: Story = {
  args: {
    ...defaultArgs,
    type: InputType.Password,
    value: 'StrongPassword123!',
    showToggle: false,
  },
};

export const LongValidationMessage: Story = {
  args: {
    ...defaultArgs,
    error: true,
    errorText: 'Enter a valid exercise name between 2 and 80 characters before continuing.',
    value: 'A',
  },
};

export const ReadOnly: Story = {
  args: { ...defaultArgs, value: 'Completed workout', readOnly: true },
};
