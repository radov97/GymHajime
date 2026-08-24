import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import UserInitials, { getUserInitials } from './UserInitials';

describe('UserInitials', () => {
  it('creates up to three initials from a full name', () => {
    expect(getUserInitials('Andrei Iulian Radovici')).toBe('AIR');
    expect(getUserInitials('  Andrei   Radovici ')).toBe('AR');
    expect(getUserInitials('Andrei Iulian Radovici Popescu')).toBe('AIR');
  });

  it('renders a rounded identity while preserving the complete name', () => {
    render(<UserInitials name="Andrei Iulian Radovici" />);
    const initials = screen.getByLabelText('Andrei Iulian Radovici');
    expect(initials).toHaveTextContent('AIR');
    expect(initials).toHaveAttribute('title', 'Andrei Iulian Radovici');
    expect(initials).toHaveClass('rounded-full');
  });
});
