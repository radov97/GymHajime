import { screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithIntl } from '../test/render';

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  onAuthStateChange: vi.fn(),
  pathname: '/en/login',
  unsubscribe: vi.fn(),
}));

vi.mock('next-intl', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next-intl')>();
  return { ...actual, useLocale: () => 'en' };
});
vi.mock('next/navigation', () => ({ usePathname: () => mocks.pathname }));
vi.mock('../lib/supabaseClient', () => ({
  default: { auth: { getUser: mocks.getUser, onAuthStateChange: mocks.onAuthStateChange } },
}));

import BrandLogo from './BrandLogo';

describe('BrandLogo', () => {
  beforeEach(() => {
    mocks.pathname = '/en/login';
    mocks.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: mocks.unsubscribe } },
    });
  });

  it('remains a plain image while signed out', async () => {
    mocks.getUser.mockResolvedValue({ data: { user: null } });
    renderWithIntl(<BrandLogo width={48} height={48} />);

    await waitFor(() => expect(mocks.getUser).toHaveBeenCalled());
    expect(screen.getByRole('img', { name: 'GymHajime logo' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Go to Daily Training' })).not.toBeInTheDocument();
  });

  it('links to localized Daily Training while signed in', async () => {
    mocks.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    renderWithIntl(<BrandLogo width={48} height={48} />);

    expect(await screen.findByRole('link', { name: 'Go to Daily Training' })).toHaveAttribute(
      'href',
      '/en/daily-training'
    );
    expect(screen.getByRole('img', { name: 'GymHajime logo' })).toHaveClass(
      'group-hover:scale-105',
      'group-hover:shadow-xl'
    );
  });

  it('remains static without hover effects on Daily Training', async () => {
    mocks.pathname = '/en/daily-training';
    mocks.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    renderWithIntl(<BrandLogo width={48} height={48} />);

    await waitFor(() => expect(mocks.getUser).toHaveBeenCalled());
    expect(screen.queryByRole('link', { name: 'Go to Daily Training' })).not.toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'GymHajime logo' })).not.toHaveClass(
      'group-hover:scale-105'
    );
  });
});
