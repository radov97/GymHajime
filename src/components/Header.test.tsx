import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Header from './Header';
import { renderWithIntl } from '../test/render';

vi.mock('next-intl', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next-intl')>();
  return { ...actual, useLocale: () => 'en' };
});

describe('Header', () => {
  it('renders branding, translated copy, and localized links', () => {
    renderWithIntl(<Header />);
    expect(screen.getByRole('heading', { name: 'GymHajime' })).toBeInTheDocument();
    expect(screen.getByText('Train with purpose')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Login' })).toHaveAttribute('href', '/en/login');
    expect(screen.getByRole('link', { name: 'Sign Up' })).toHaveAttribute('href', '/en/signup');
  });
});
