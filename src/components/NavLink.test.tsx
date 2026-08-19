import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import NavLink from './NavLink';

describe('NavLink', () => {
  it('renders the destination and label', () => {
    render(<NavLink href="/en/login" text="Login" />);
    expect(screen.getByRole('link', { name: 'Login' })).toHaveAttribute('href', '/en/login');
  });
});
