import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import OptionPills from './OptionPills';

const options = [
  { value: '', label: 'All' },
  { value: 'chest', label: 'Chest' },
  { value: 'back', label: 'Back', disabled: true },
];

describe('OptionPills', () => {
  it('renders a labelled group and marks the selected option', () => {
    render(
      <OptionPills
        value="chest"
        options={options}
        onChange={vi.fn()}
        ariaLabel="Exercise category"
      />
    );

    expect(screen.getByRole('group', { name: 'Exercise category' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Chest' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('reports the selected option value', () => {
    const onChange = vi.fn();
    render(<OptionPills value="" options={options} onChange={onChange} ariaLabel="Category" />);
    fireEvent.click(screen.getByRole('button', { name: 'Chest' }));
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledWith('chest');
  });

  it('prevents disabled options from being selected', () => {
    const onChange = vi.fn();
    render(<OptionPills value="" options={options} onChange={onChange} ariaLabel="Category" />);
    const disabled = screen.getByRole('button', { name: 'Back' });
    expect(disabled).toBeDisabled();
    fireEvent.click(disabled);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('applies consumer layout classes to the group', () => {
    render(
      <OptionPills
        value=""
        options={options}
        onChange={vi.fn()}
        ariaLabel="Category"
        className="hidden md:flex"
      />
    );
    expect(screen.getByRole('group')).toHaveClass('hidden', 'md:flex');
  });
});
