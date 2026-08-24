import { Plus } from 'lucide-react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import IconButton from './IconButton';

describe('IconButton', () => {
  it('renders its accessible visible label and decorative icon', () => {
    const { container } = render(<IconButton icon={<Plus />} label="Add Exercise" />);
    expect(screen.getByRole('button', { name: 'Add Exercise' })).toBeInTheDocument();
    expect(container.querySelector('span')).toHaveAttribute('aria-hidden', 'true');
  });

  it.each([
    ['primary', 'bg-orange-500'],
    ['outline', 'border-orange-300'],
    ['danger', 'border-red-200'],
    ['ghost', 'border-transparent'],
  ] as const)('applies the %s variant', (variant, expectedClass) => {
    render(<IconButton icon={<Plus />} label="Action" variant={variant} />);
    expect(screen.getByRole('button')).toHaveClass(expectedClass);
  });

  it('uses the hidden label as the accessible name in icon-only mode', () => {
    render(<IconButton icon={<Plus />} label="Add" iconOnly variant="ghost" />);
    expect(screen.getByRole('button', { name: 'Add' })).toHaveTextContent('');
  });

  it('forwards interactions and native button properties', () => {
    const onClick = vi.fn();
    render(<IconButton icon={<Plus />} label="Add" onClick={onClick} title="Add item" />);
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.getByRole('button')).toHaveAttribute('title', 'Add item');
  });

  it('prevents interaction while disabled', () => {
    const onClick = vi.fn();
    render(<IconButton icon={<Plus />} label="Add" onClick={onClick} disabled />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});
