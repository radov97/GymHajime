import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ChevronButton from './ChevronButton';

describe('ChevronButton', () => {
  it('exposes its closed state and handles clicks', () => {
    const onClick = vi.fn();
    render(<ChevronButton isOpen={false} onClick={onClick} label="Account menu" />);

    const button = screen.getByRole('button', { name: 'Account menu' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('rotates the icon when open', () => {
    render(<ChevronButton isOpen onClick={() => {}} label="Account menu" />);

    expect(screen.getByRole('button').querySelector('svg')).toHaveClass('rotate-180');
  });
});
