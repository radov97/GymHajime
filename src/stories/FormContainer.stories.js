import FormContainer from '../components/FormContainer';

export default {
  title: 'FormContainer',
  component: FormContainer,
};

const Template = (args) => (
  <div className="min-h-screen bg-[var(--color-brand-dark)] flex items-center justify-center p-4">
    <FormContainer {...args}>
      <h2 className="text-xl font-bold text-[var(--color-brand-ink)] mb-4">
        Sign up for GymHajime
      </h2>
      <input
        type="text"
        placeholder="Full Name"
        className="w-full border border-gray-300 rounded p-2 mb-3"
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full border border-gray-300 rounded p-2 mb-3"
      />
      <button className="w-full bg-[var(--color-brand)] text-white font-semibold py-2 rounded hover:opacity-90 transition-all duration-200">
        Create Account
      </button>
    </FormContainer>
  </div>
);

export const Default = Template.bind({});
