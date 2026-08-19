import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithIntl } from '../test/render';

const navigation = vi.hoisted(() => ({ pathname: '/en/dashboard' }));

vi.mock('next/navigation', () => ({ usePathname: () => navigation.pathname }));
vi.mock('next-intl', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next-intl')>();
  return { ...actual, useLocale: () => 'en' };
});

import Sidebar from './Sidebar';

describe('Sidebar', () => {
  it('renders localized navigation with the current page highlighted', () => {
    renderWithIntl(<Sidebar />);

    expect(screen.getByRole('complementary', { name: 'Application sidebar' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Settings' })).toHaveAttribute('href', '/en/settings');
    expect(screen.getAllByRole('link')).toHaveLength(7);
  });

  it('collapses to accessible icon-only navigation and expands again', () => {
    renderWithIntl(<Sidebar />);

    fireEvent.click(screen.getByRole('button', { name: 'Collapse sidebar' }));
    expect(screen.queryByText('GYMHAJIME')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('title', 'Dashboard');

    fireEvent.click(screen.getByRole('button', { name: 'Expand sidebar' }));
    expect(screen.getByText('GYMHAJIME')).toBeInTheDocument();
  });
});
