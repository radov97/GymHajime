import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Header from './Header';
import { renderWithIntl } from '../test/render';

vi.mock('next-intl', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next-intl')>();
  return { ...actual, useLocale: () => 'en' };
});
vi.mock('./AuthNavigation', () => ({ default: () => <nav>Account navigation</nav> }));
vi.mock('./BrandLogo', () => ({
  default: () => <span role="img" aria-label="GymHajime logo" />,
}));

describe('Header', () => {
  it('renders branding, translated copy, and localized links', () => {
    renderWithIntl(<Header />);
    expect(screen.getByRole('banner')).toHaveClass('py-2', 'shadow-sm');
    expect(screen.getByRole('heading', { name: 'GymHajime' })).toBeInTheDocument();
    expect(screen.getByText('Train with purpose')).toBeInTheDocument();
    expect(screen.getByText('Account navigation')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'What is Hajime?' })).toBeInTheDocument();
  });
});
