import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, userEvent, within } from 'storybook/test';
import Sidebar from '../components/Sidebar';
import { Context as ResponsiveContext } from 'react-responsive';
import { BREAKPOINTS } from '../lib/breakpoints';

const meta = {
  title: 'Navigation/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    nextjs: { navigation: { pathname: '/en/dashboard' } },
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DashboardActive: Story = {
  play: async ({ canvasElement }) => {
    const dashboard = within(canvasElement).getByRole('link', { name: 'Dashboard' });
    await expect(dashboard).toHaveAttribute('aria-current', 'page');
  },
};

export const Collapsed: Story = {
  args: { initiallyCollapsed: true },
};

export const InteractiveCollapse: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Collapse sidebar' }));
    await expect(canvas.getByRole('button', { name: 'Expand sidebar' })).toBeVisible();
  },
};

export const Romanian: Story = {
  globals: { locale: 'ro' },
  parameters: { nextjs: { navigation: { pathname: '/ro/dashboard' } } },
};

export const SettingsActive: Story = {
  parameters: { nextjs: { navigation: { pathname: '/en/settings' } } },
};

export const MobileBreakpoint: Story = {
  decorators: [
    (Story) => (
      <ResponsiveContext.Provider value={{ width: BREAKPOINTS.mobileMax }}>
        <Story />
      </ResponsiveContext.Provider>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByText('GYMHAJIME')).not.toBeInTheDocument();
    await expect(canvas.queryByRole('button', { name: /sidebar/i })).not.toBeInTheDocument();
  },
};

export const Mobile: Story = {
  decorators: [
    (Story) => (
      <ResponsiveContext.Provider value={{ width: 390 }}>
        <Story />
      </ResponsiveContext.Provider>
    ),
  ],
};
