import FormContainerPalco from '../components/FormContainerPalco';

export default {
  title: 'FormContainerPalco',
  component: FormContainerPalco,
};

const Template = (args) => (
  <div className="min-h-screen bg-[var(--color-palco-dark)] flex items-center justify-center p-4">
    <FormContainerPalco {...args}>
      <h2 className="text-xl font-bold text-[var(--color-palco-black)] mb-4">
        Sign up for FindPalco
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
      <button className="w-full bg-[var(--color-palco)] text-white font-semibold py-2 rounded hover:opacity-90 transition-all duration-200">
        Create Account
      </button>
    </FormContainerPalco>
  </div>
);

export const Default = Template.bind({});
