import ButtonPalco from '../components/ButtonPalco';
import { ButtonType, ButtonRank } from '@/lib/enums';

export default {
  title: 'ButtonPalco',
  component: ButtonPalco,
  argTypes: {
    text: {
      control: 'text',
      description: 'Button label text',
    },
    type: {
      control: { type: 'select' },
      options: Object.values(ButtonType),
      description: 'HTML button type',
    },
    rank: {
      control: { type: 'select' },
      options: Object.values(ButtonRank),
      description: 'Visual style for the button',
    },
    loading: {
      control: 'boolean',
      description: 'Show a loading spinner',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the button',
    },
    onClick: {
      action: 'clicked',
      description: 'Click handler',
    },
  },
};

const Template = (args) => <ButtonPalco {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  text: 'Submit',
  rank: ButtonRank.Primary,
  type: ButtonType.Submit,
  loading: false,
  disabled: false,
  onClick: () => console.log('Primary button clicked'),
};

export const Secondary = Template.bind({});
Secondary.args = {
  text: 'Cancel',
  rank: ButtonRank.Secondary,
  type: ButtonType.Button,
  loading: false,
  disabled: false,
  onClick: () => console.log('Secondary button clicked'),
};

export const Link = Template.bind({});
Link.args = {
  text: 'Redirect me to ...',
  rank: ButtonRank.Link,
  type: ButtonType.Button,
  loading: false,
  disabled: false,
  onClick: () => console.log('Secondary button clicked'),
};

export const Loading = Template.bind({});
Loading.args = {
  text: 'Loading...',
  rank: ButtonRank.Primary,
  type: ButtonType.Button,
  loading: true,
  disabled: false,
};

export const Disabled = Template.bind({});
Disabled.args = {
  text: 'Disabled',
  rank: ButtonRank.Secondary,
  type: ButtonType.Button,
  loading: false,
  disabled: true,
};
