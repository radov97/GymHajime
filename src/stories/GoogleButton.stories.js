import GoogleButton from '../components/GoogleButton';

export default {
  title: 'GoogleButton',
  component: GoogleButton,
  argTypes: {
    text: { control: 'text' },
    width: { control: 'number' },
    height: { control: 'number' },
    onClick: { action: 'clicked' },
  },
};

const Template = (args) => (
  <div className="max-w-xs mx-auto p-4 bg-gray-100 rounded">
    <GoogleButton {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  text: 'Sign up with Google',
  width: 40,
  height: 40,
};

export const Disabled = Template.bind({});
Disabled.args = {
  text: 'Sign up with Google',
  width: 40,
  height: 40,
  disabled: true,
};
