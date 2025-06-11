import InputPalco from '../components/InputPalco';
import { InputType } from '@/lib/enums';
import React, { useState } from 'react';

export default {
  title: 'InputPalco',
  component: InputPalco,
  argTypes: {
    type: {
      control: { type: 'select' },
      options: Object.values(InputType),
    },
    placeholder: { control: 'text' },
    value: { control: 'text' },
    error: { control: 'boolean' },
    errorText: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    showToggle: { control: 'boolean' },
    debounceDelay: { control: 'number' },
    className: { control: 'text' },
  },
};

const Template = (args) => {
  const [val, setVal] = useState(args.value || '');

  return (
    <div className="w-full max-w-md mx-auto">
      <InputPalco
        {...args}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onDebouncedChange={(debounced) => console.log('Debounced:', debounced)}
      />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  type: InputType.Text,
  placeholder: 'Your input here',
  error: false,
  errorText: '',
  disabled: false,
  required: false,
  showToggle: false,
  debounceDelay: 300,
};

export const EmailInput = Template.bind({});
EmailInput.args = {
  ...Default.args,
  type: InputType.Email,
  placeholder: 'Your email',
};

export const PasswordInput = Template.bind({});
PasswordInput.args = {
  ...Default.args,
  type: InputType.Password,
  placeholder: 'Enter your password',
  showToggle: true,
};

export const WithError = Template.bind({});
WithError.args = {
  ...Default.args,
  placeholder: 'Error example',
  error: true,
  errorText: 'This field is required.',
};

export const DisabledInput = Template.bind({});
DisabledInput.args = {
  ...Default.args,
  placeholder: 'Disabled input',
  disabled: true,
};
