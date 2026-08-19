import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Button from './Button';
import { ButtonRank, ButtonType } from '../lib/enums';

describe('Button', () => {
  it('renders its label and forwards click events', () => {
    const onClick = vi.fn();
    render(<Button text="Save workout" onClick={onClick} />);

    fireEvent.click(screen.getByRole('button', { name: 'Save workout' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('supports semantic button types and visual ranks', () => {
    render(<Button text="Reset" type={ButtonType.Reset} rank={ButtonRank.Link} />);
    const button = screen.getByRole('button', { name: 'Reset' });

    expect(button).toHaveAttribute('type', 'reset');
    expect(button).toHaveClass('border-[var(--color-brand)]');
  });

  it('disables interaction while loading', () => {
    render(<Button text="Saving" loading />);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.queryByText('Saving')).not.toBeInTheDocument();
  });
});
