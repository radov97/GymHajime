import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Context as ResponsiveContext } from 'react-responsive';
import ResponsiveHeader from '../components/ResponsiveHeader';

const meta = {
  title: 'Navigation/ResponsiveHeader',
  component: ResponsiveHeader,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ResponsiveHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  decorators: [
    (Story) => (
      <ResponsiveContext.Provider value={{ width: 1280 }}>
        <Story />
      </ResponsiveContext.Provider>
    ),
  ],
};

export const Mobile: Story = {
  decorators: [
    (Story) => (
      <ResponsiveContext.Provider value={{ width: 390 }}>
        <div className="w-[390px] max-w-full">
          <Story />
        </div>
      </ResponsiveContext.Provider>
    ),
  ],
};

export const TabletBreakpoint: Story = {
  decorators: [
    (Story) => (
      <ResponsiveContext.Provider value={{ width: 768 }}>
        <div className="w-[768px] max-w-full">
          <Story />
        </div>
      </ResponsiveContext.Provider>
    ),
  ],
};
