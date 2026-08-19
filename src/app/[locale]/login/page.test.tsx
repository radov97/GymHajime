import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithIntl } from '../../../test/render';

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  signInWithPassword: vi.fn(),
  signInWithOAuth: vi.fn(),
}));

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: mocks.push }) }));
vi.mock('next-intl', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next-intl')>();
  return { ...actual, useLocale: () => 'en' };
});
vi.mock('../../../lib/supabaseClient', () => ({
  default: {
    auth: {
      signInWithPassword: mocks.signInWithPassword,
      signInWithOAuth: mocks.signInWithOAuth,
    },
  },
}));

import LoginPage from './page';

function completeLoginForm() {
  fireEvent.change(screen.getByPlaceholderText('Email'), {
    target: { value: 'athlete@example.com' },
  });
  fireEvent.change(screen.getByPlaceholderText('Password'), {
    target: { value: 'StrongPass1!' },
  });
  act(() => vi.advanceTimersByTime(1000));
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000';
    mocks.signInWithPassword.mockResolvedValue({ error: null });
    mocks.signInWithOAuth.mockResolvedValue({ error: null });
  });
  afterEach(() => vi.useRealTimers());

  it('signs in with validated credentials and routes home', async () => {
    renderWithIntl(<LoginPage />);
    completeLoginForm();
    vi.useRealTimers();
    const submit = screen.getByRole('button', { name: 'Login' });
    expect(submit).toBeEnabled();
    fireEvent.click(submit);

    await waitFor(() =>
      expect(mocks.signInWithPassword).toHaveBeenCalledWith({
        email: 'athlete@example.com',
        password: 'StrongPass1!',
      })
    );
    expect(mocks.push).toHaveBeenCalledWith('/en/dashboard');
  });

  it('shows a useful invalid-credentials message', async () => {
    mocks.signInWithPassword.mockResolvedValue({
      error: { code: 'invalid_credentials', message: 'Invalid credentials' },
    });
    renderWithIntl(<LoginPage />);
    completeLoginForm();
    vi.useRealTimers();
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    expect(await screen.findByText(/Incorrect email or password/i)).toBeInTheDocument();
  });

  it('starts Google OAuth with the localized callback URL', async () => {
    renderWithIntl(<LoginPage />);
    vi.useRealTimers();
    fireEvent.click(screen.getByRole('button', { name: /Sign in with Google/ }));
    await waitFor(() =>
      expect(mocks.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: { redirectTo: 'http://localhost:3000/en/auth/callback' },
      })
    );
  });
});
