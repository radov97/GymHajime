import { screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithIntl } from '../../../test/render';

const mocks = vi.hoisted(() => ({ getUser: vi.fn(), replace: vi.fn() }));

vi.mock('next/navigation', () => ({ useRouter: () => ({ replace: mocks.replace }) }));
vi.mock('next-intl', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next-intl')>();
  return { ...actual, useLocale: () => 'en' };
});
vi.mock('../../../lib/supabaseClient', () => ({
  default: { auth: { getUser: mocks.getUser } },
}));

import DashboardPage from './page';

describe('DashboardPage', () => {
  beforeEach(() => mocks.replace.mockClear());

  it('renders for an authenticated user', async () => {
    mocks.getUser.mockResolvedValue({ data: { user: { id: 'user-1' } } });
    renderWithIntl(<DashboardPage />);

    expect(await screen.findByRole('heading', { name: 'This is the dashboard' })).toBeInTheDocument();
    expect(mocks.replace).not.toHaveBeenCalled();
  });

  it('redirects an unauthenticated visitor to localized login', async () => {
    mocks.getUser.mockResolvedValue({ data: { user: null } });
    renderWithIntl(<DashboardPage />);

    await waitFor(() => expect(mocks.replace).toHaveBeenCalledWith('/en/login'));
    expect(screen.queryByText('This is the dashboard')).not.toBeInTheDocument();
  });
});
