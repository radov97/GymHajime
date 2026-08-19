import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithIntl } from '../../../test/render';

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  getUser: vi.fn(),
  signUp: vi.fn(),
  signInWithOAuth: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mocks.push, replace: mocks.replace }),
}));
vi.mock('next-intl', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next-intl')>();
  return { ...actual, useLocale: () => 'en' };
});
vi.mock('../../../lib/supabaseClient', () => ({
  default: {
    auth: {
      getUser: mocks.getUser,
      signUp: mocks.signUp,
      signInWithOAuth: mocks.signInWithOAuth,
    },
  },
}));

import SignUpPage from './page';

function completeSignupForm() {
  fireEvent.change(screen.getByPlaceholderText('Email'), {
    target: { value: 'athlete@example.com' },
  });
  fireEvent.change(screen.getByPlaceholderText('Full Name'), {
    target: { value: 'Test Athlete' },
  });
  fireEvent.change(screen.getByPlaceholderText('Password'), {
    target: { value: 'StrongPass1!' },
  });
  act(() => vi.advanceTimersByTime(1000));
}

describe('SignUpPage', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000';
    mocks.getUser.mockResolvedValue({ data: { user: null } });
    mocks.signUp.mockResolvedValue({ error: null });
    mocks.signInWithOAuth.mockResolvedValue({ error: null });
  });
  afterEach(() => vi.useRealTimers());

  it('creates an account with profile metadata and confirmation redirect', async () => {
    renderWithIntl(<SignUpPage />);
    await act(async () => Promise.resolve());
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    completeSignupForm();
    vi.useRealTimers();
    const submit = screen.getByRole('button', { name: 'Sign Up' });
    expect(submit).toBeEnabled();
    fireEvent.click(submit);

    await waitFor(() =>
      expect(mocks.signUp).toHaveBeenCalledWith({
        email: 'athlete@example.com',
        password: 'StrongPass1!',
        options: {
          emailRedirectTo: 'http://localhost:3000/en/auth/confirmed',
          data: { full_name: 'Test Athlete' },
        },
      })
    );
    expect(mocks.push).toHaveBeenCalledWith('/en/login');
  });

  it('shows the generic error when signup fails', async () => {
    mocks.signUp.mockResolvedValue({ error: { message: 'Signup failed' } });
    renderWithIntl(<SignUpPage />);
    await act(async () => Promise.resolve());
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    completeSignupForm();
    vi.useRealTimers();
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
    expect(await screen.findByText(/Something went wrong/i)).toBeInTheDocument();
  });

  it('starts Google OAuth with the localized callback URL', async () => {
    renderWithIntl(<SignUpPage />);
    vi.useRealTimers();
    fireEvent.click(await screen.findByRole('button', { name: /Sign up with Google/ }));
    await waitFor(() =>
      expect(mocks.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: { redirectTo: 'http://localhost:3000/en/auth/callback' },
      })
    );
  });

  it('redirects an existing session away from a hardcoded signup URL', async () => {
    mocks.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    renderWithIntl(<SignUpPage />);
    expect(screen.getByRole('status')).toHaveTextContent('Checking session...');
    expect(screen.queryByRole('heading', { name: 'New Account' })).not.toBeInTheDocument();
    vi.useRealTimers();

    await waitFor(() => expect(mocks.replace).toHaveBeenCalledWith('/en/dashboard'));
  });
});
