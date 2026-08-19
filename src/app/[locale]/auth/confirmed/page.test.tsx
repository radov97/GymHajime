import { act, fireEvent, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithIntl } from '../../../../test/render';

const router = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => router }));
vi.mock('next-intl', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next-intl')>();
  return { ...actual, useLocale: () => 'en' };
});

import LocaleConfirmedPage from './page';

describe('LocaleConfirmedPage', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('lets the user continue immediately', () => {
    renderWithIntl(<LocaleConfirmedPage />);
    expect(screen.getByRole('heading', { name: 'Email Confirmed!' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(router.push).toHaveBeenCalledWith('/en/login');
  });

  it('automatically redirects after ten seconds', () => {
    renderWithIntl(<LocaleConfirmedPage />);
    act(() => vi.advanceTimersByTime(10_000));
    expect(router.push).toHaveBeenCalledWith('/en/login');
  });
});
