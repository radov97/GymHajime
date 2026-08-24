import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const router = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => router }));
vi.mock('next-intl', () => ({
  useLocale: () => 'en',
  useTranslations: () => (key: string) => (key === 'signing-you-in' ? 'Signing you in...' : key),
}));

import AuthCallbackPage from './page';

describe('AuthCallbackPage', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('cleans the auth hash and redirects after the delay', () => {
    window.location.hash = '#access_token=test';
    const replaceState = vi.spyOn(window.history, 'replaceState');
    render(<AuthCallbackPage />);

    expect(screen.getByText('Signing you in...')).toBeInTheDocument();
    expect(replaceState).toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1000));
    expect(router.push).toHaveBeenCalledWith('/en/daily-training');
  });
});
