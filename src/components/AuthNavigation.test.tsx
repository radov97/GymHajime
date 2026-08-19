import { fireEvent, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithIntl } from '../test/render';

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(), onAuthStateChange: vi.fn(), signOut: vi.fn(),
  push: vi.fn(), refresh: vi.fn(), unsubscribe: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mocks.push, refresh: mocks.refresh }),
}));
vi.mock('next-intl', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next-intl')>();
  return { ...actual, useLocale: () => 'en' };
});
vi.mock('../lib/supabaseClient', () => ({
  default: { auth: {
    getUser: mocks.getUser,
    onAuthStateChange: mocks.onAuthStateChange,
    signOut: mocks.signOut,
  } },
}));

import AuthNavigation from './AuthNavigation';

describe('AuthNavigation', () => {
  beforeEach(() => {
    mocks.getUser.mockResolvedValue({ data: { user: null } });
    mocks.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: mocks.unsubscribe } },
    });
    mocks.signOut.mockResolvedValue({ error: null });
  });

  it('shows account links when signed out', async () => {
    renderWithIntl(<AuthNavigation />);
    await waitFor(() => expect(mocks.getUser).toHaveBeenCalled());
    expect(screen.getByRole('link', { name: 'Login' })).toHaveAttribute('href', '/en/login');
    expect(screen.getByRole('link', { name: 'Sign Up' })).toHaveAttribute('href', '/en/signup');
  });

  it('shows the user name and logs out from the dropdown', async () => {
    mocks.getUser.mockResolvedValue({
      data: { user: { email: 'athlete@example.com', user_metadata: { full_name: 'Test Athlete' } } },
    });
    renderWithIntl(<AuthNavigation />);

    fireEvent.click(await screen.findByRole('button', { name: /Welcome, Test Athlete/ }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Logout' }));

    await waitFor(() => expect(mocks.signOut).toHaveBeenCalled());
    expect(mocks.push).toHaveBeenCalledWith('/en/login');
    expect(mocks.refresh).toHaveBeenCalled();
  });
});
