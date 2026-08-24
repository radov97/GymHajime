import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ push: vi.fn(), refresh: vi.fn() }));

vi.mock('next-intl', () => ({ useLocale: () => 'en' }));
vi.mock('next/navigation', () => ({
  usePathname: () => '/en/daily-training',
  useRouter: () => ({ push: mocks.push, refresh: mocks.refresh }),
}));

import LanguageSelector from './LanguageSelector';

describe('LanguageSelector', () => {
  afterEach(() => {
    document.cookie = 'NEXT_LOCALE=; path=/; max-age=0';
  });

  it('shows all supported languages and marks the current one disabled', () => {
    render(<LanguageSelector />);
    fireEvent.click(screen.getByRole('button', { name: /Current language: English/ }));

    expect(screen.getAllByRole('menuitem')).toHaveLength(7);
    expect(screen.getByRole('menuitem', { name: 'English' })).toBeDisabled();
  });

  it('stores the preference and preserves the current route in the new locale', () => {
    render(<LanguageSelector />);
    fireEvent.click(screen.getByRole('button', { name: /Current language: English/ }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Română' }));

    expect(document.cookie).toContain('NEXT_LOCALE=ro');
    expect(mocks.push).toHaveBeenCalledWith('/ro/daily-training');
    expect(mocks.refresh).toHaveBeenCalled();
  });

  it('closes when clicking outside', () => {
    render(
      <>
        <LanguageSelector />
        <button type="button">Outside</button>
      </>
    );
    fireEvent.click(screen.getByRole('button', { name: /Current language: English/ }));
    fireEvent.pointerDown(screen.getByRole('button', { name: 'Outside' }));

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
