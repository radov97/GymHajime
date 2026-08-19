import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const router = vi.hoisted(() => ({ replace: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => router }));

import AuthConfirmedRedirect from './page';

describe('AuthConfirmedRedirect', () => {
  beforeEach(() => {
    Object.defineProperty(window.navigator, 'language', { value: 'ro-RO', configurable: true });
  });

  it('redirects to the browser language confirmation page', async () => {
    render(<AuthConfirmedRedirect />);
    await waitFor(() => expect(router.replace).toHaveBeenCalledWith('/ro/auth/confirmed'));
    expect(screen.getByRole('heading', { name: 'GymHajime' })).toBeInTheDocument();
  });
});
