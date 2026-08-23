import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import TabSelector from './TabSelector';

const options = [
  { value: 'explore', label: 'Explore Exercises' },
  { value: 'mine', label: 'My Exercises' },
  { value: 'builder', label: 'Workout Builder', disabled: true },
];

describe('TabSelector', () => {
  it('renders an accessible tablist and selected tab', () => {
    render(
      <TabSelector
        value="mine"
        options={options}
        onChange={vi.fn()}
        ariaLabel="Exercise sections"
      />
    );
    expect(screen.getByRole('tablist', { name: 'Exercise sections' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'My Exercises' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
    expect(screen.getByRole('tab', { name: 'Explore Exercises' })).toHaveAttribute(
      'aria-selected',
      'false'
    );
  });

  it('reports the selected tab value', () => {
    const onChange = vi.fn();
    render(
      <TabSelector value="explore" options={options} onChange={onChange} ariaLabel="Sections" />
    );
    fireEvent.click(screen.getByRole('tab', { name: 'My Exercises' }));
    expect(onChange).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledWith('mine');
  });

  it('prevents disabled tabs from being selected', () => {
    const onChange = vi.fn();
    render(
      <TabSelector value="explore" options={options} onChange={onChange} ariaLabel="Sections" />
    );
    const disabled = screen.getByRole('tab', { name: 'Workout Builder' });
    expect(disabled).toBeDisabled();
    fireEvent.click(disabled);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('applies consumer classes to the tablist', () => {
    render(
      <TabSelector
        value="explore"
        options={options}
        onChange={vi.fn()}
        ariaLabel="Sections"
        className="px-4"
      />
    );
    expect(screen.getByRole('tablist')).toHaveClass('px-4');
  });
});
