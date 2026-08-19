import { Context as ResponsiveContext } from 'react-responsive';
import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ResponsiveHeader from './ResponsiveHeader';
import { renderWithIntl } from '../test/render';
import Link from 'next/link';

vi.mock('next-intl', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next-intl')>();
  return { ...actual, useLocale: () => 'en' };
});
vi.mock('./AuthNavigation', () => ({ default: () => <Link href="/en/login">Login</Link> }));

describe('ResponsiveHeader', () => {
  it('renders the desktop navigation above the breakpoint', async () => {
    renderWithIntl(
      <ResponsiveContext.Provider value={{ width: 1280 }}>
        <ResponsiveHeader />
      </ResponsiveContext.Provider>
    );
    await waitFor(() => expect(screen.getByRole('link', { name: 'Login' })).toBeInTheDocument());
  });

  it('renders the compact header at the mobile breakpoint', async () => {
    renderWithIntl(
      <ResponsiveContext.Provider value={{ width: 390 }}>
        <ResponsiveHeader />
      </ResponsiveContext.Provider>
    );
    await waitFor(() => expect(screen.getByText('GymHajime')).toBeInTheDocument());
    expect(screen.getByRole('link', { name: 'Login' })).toBeInTheDocument();
  });
});
