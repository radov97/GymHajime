import { fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithIntl } from '../test/render';
import { Context as ResponsiveContext } from 'react-responsive';
import { BREAKPOINTS } from '../lib/breakpoints';

const navigation = vi.hoisted(() => ({ pathname: '/en/daily-training' }));

vi.mock('next/navigation', () => ({ usePathname: () => navigation.pathname }));
vi.mock('next-intl', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next-intl')>();
  return { ...actual, useLocale: () => 'en' };
});

import Sidebar from './Sidebar';

describe('Sidebar', () => {
  it('renders localized navigation with the current page highlighted', () => {
    renderWithIntl(<Sidebar />);

    expect(screen.getByRole('complementary', { name: 'Application sidebar' })).toHaveClass(
      'h-full',
      'overflow-hidden'
    );
    expect(screen.getByRole('link', { name: 'Daily Training' })).toHaveAttribute(
      'aria-current',
      'page'
    );
    expect(screen.getByRole('link', { name: 'Settings' })).toHaveAttribute('href', '/en/settings');
    const navigationLinks = within(
      screen.getByRole('navigation', { name: 'Training navigation' })
    ).getAllByRole('link');
    expect(navigationLinks).toHaveLength(7);
    expect(navigationLinks.at(-1)).toHaveAccessibleName('Settings');
  });

  it('collapses to accessible icon-only navigation and expands again', () => {
    renderWithIntl(<Sidebar />);

    fireEvent.click(screen.getByRole('button', { name: 'Collapse sidebar' }));
    expect(screen.queryByText('GYMHAJIME')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Daily Training' })).toHaveAttribute(
      'title',
      'Daily Training'
    );

    fireEvent.click(screen.getByRole('button', { name: 'Expand sidebar' }));
    expect(screen.getByText('GYMHAJIME')).toBeInTheDocument();
  });

  it('stays collapsed and hides the toggle on mobile and tablet widths', () => {
    renderWithIntl(
      <ResponsiveContext.Provider value={{ width: BREAKPOINTS.mobileMax }}>
        <Sidebar />
      </ResponsiveContext.Provider>
    );

    expect(screen.queryByText('GYMHAJIME')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /sidebar/i })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Daily Training' })).toHaveAttribute(
      'title',
      'Daily Training'
    );
  });
});
