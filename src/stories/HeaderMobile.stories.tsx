import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import HeaderMobile from '../components/HeaderMobile';

const meta = {
  title: 'Navigation/HeaderMobile',
  component: HeaderMobile,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof HeaderMobile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StandardMobile: Story = {
  decorators: [
    (Story) => (
      <div className="w-[390px] max-w-full">
        <Story />
      </div>
    ),
  ],
};

export const NarrowMobile: Story = {
  decorators: [
    (Story) => (
      <div className="w-[320px] max-w-full">
        <Story />
      </div>
    ),
  ],
};
