import { screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithIntl } from '../test/render';

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  replace: vi.fn(),
  onAuthStateChange: vi.fn(),
  unsubscribe: vi.fn(),
}));

vi.mock('next/navigation', () => ({ useRouter: () => ({ replace: mocks.replace }) }));
vi.mock('next-intl', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next-intl')>();
  return { ...actual, useLocale: () => 'en' };
});
vi.mock('../lib/supabaseClient', () => ({
  default: { auth: { getUser: mocks.getUser, onAuthStateChange: mocks.onAuthStateChange } },
}));
vi.mock('./Sidebar', () => ({ default: () => <aside>Sidebar</aside> }));

import AuthenticatedShell from './AuthenticatedShell';

describe('AuthenticatedShell', () => {
  beforeEach(() => {
    mocks.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: mocks.unsubscribe } },
    });
  });

  it('shows the sidebar and page after confirming an authenticated user', async () => {
    mocks.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    const { container } = renderWithIntl(<AuthenticatedShell>Private page</AuthenticatedShell>);

    expect(await screen.findByText('Private page')).toBeInTheDocument();
    expect(screen.getByText('Sidebar')).toBeInTheDocument();
    const shell = container.firstElementChild;
    expect(shell).toHaveClass('h-full', 'overflow-hidden');
    expect(screen.getByText('Private page')).toHaveClass(
      'h-full',
      'overflow-y-auto',
      'overscroll-contain'
    );
  });

  it('hides private content and redirects signed-out visitors', async () => {
    mocks.getUser.mockResolvedValue({ data: { user: null } });
    renderWithIntl(<AuthenticatedShell>Private page</AuthenticatedShell>);

    await waitFor(() => expect(mocks.replace).toHaveBeenCalledWith('/en/login'));
    expect(screen.queryByText('Private page')).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Checking session...');
  });
});
