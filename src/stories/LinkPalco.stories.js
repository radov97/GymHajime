import LinkPalco from '../components/LinkPalco';

export default {
  title: 'LinkPalco',
  component: LinkPalco,
  argTypes: {
    text: { control: 'text' },
    href: { control: 'text' },
  },
};

const Template = (args) => (
  <div
    className="p-4"
    style={{
      backgroundColor: 'var(--color-palco-dark)',
      display: 'inline-block',
      borderRadius: '8px',
    }}
  >
    <LinkPalco {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  text: 'Login',
  href: '/en/login',
};
