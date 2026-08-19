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
vi.mock('./LanguageSelector', () => ({ default: () => <button type="button">Language</button> }));

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

    expect(await screen.findByText('Test Athlete')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Account menu' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Logout' }));
    expect(screen.getByRole('heading', { name: 'Confirm logout' })).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to log out?')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Log out' }));

    await waitFor(() => expect(mocks.signOut).toHaveBeenCalled());
    expect(mocks.push).toHaveBeenCalledWith('/en/login');
    expect(mocks.refresh).toHaveBeenCalled();
  });

  it('cancels logout without ending the session', async () => {
    mocks.getUser.mockResolvedValue({
      data: { user: { email: 'athlete@example.com', user_metadata: { full_name: 'Test Athlete' } } },
    });
    renderWithIntl(<AuthNavigation />);

    fireEvent.click(await screen.findByRole('button', { name: 'Account menu' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Logout' }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByRole('heading', { name: 'Confirm logout' })).not.toBeInTheDocument();
    expect(mocks.signOut).not.toHaveBeenCalled();
  });

  it('closes the logout confirmation from the X button', async () => {
    mocks.getUser.mockResolvedValue({
      data: { user: { email: 'athlete@example.com', user_metadata: { full_name: 'Test Athlete' } } },
    });
    renderWithIntl(<AuthNavigation />);

    fireEvent.click(await screen.findByRole('button', { name: 'Account menu' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Logout' }));
    fireEvent.click(screen.getByRole('button', { name: 'Close modal' }));

    expect(screen.queryByRole('heading', { name: 'Confirm logout' })).not.toBeInTheDocument();
    expect(mocks.signOut).not.toHaveBeenCalled();
  });

  it('closes the dropdown when clicking outside the account navigation', async () => {
    mocks.getUser.mockResolvedValue({
      data: { user: { email: 'athlete@example.com', user_metadata: { full_name: 'Test Athlete' } } },
    });
    renderWithIntl(
      <>
        <AuthNavigation />
        <button type="button">Outside</button>
      </>
    );

    const toggle = await screen.findByRole('button', { name: 'Account menu' });
    fireEvent.click(toggle);
    expect(screen.getByRole('menuitem', { name: 'Logout' })).toBeInTheDocument();

    fireEvent.click(toggle);
    expect(screen.queryByRole('menuitem', { name: 'Logout' })).not.toBeInTheDocument();

    fireEvent.click(toggle);

    fireEvent.pointerDown(screen.getByRole('button', { name: 'Outside' }));
    expect(screen.queryByRole('menuitem', { name: 'Logout' })).not.toBeInTheDocument();
  });
});
