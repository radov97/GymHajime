import NavLink from '../components/NavLink';

export default {
  title: 'NavLink',
  component: NavLink,
  argTypes: {
    text: { control: 'text' },
    href: { control: 'text' },
  },
};

const Template = (args) => (
  <div
    className="p-4"
    style={{
      backgroundColor: 'var(--color-brand-dark)',
      display: 'inline-block',
      borderRadius: '8px',
    }}
  >
    <NavLink {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  text: 'Login',
  href: '/en/login',
};
