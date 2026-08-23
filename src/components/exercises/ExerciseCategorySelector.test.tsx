import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ExerciseCategorySelector from './ExerciseCategorySelector';

describe('ExerciseCategorySelector', () => {
  it('renders matching mobile and desktop category options', () => {
    render(
      <ExerciseCategorySelector
        value=""
        categories={['chest', 'back']}
        onChange={vi.fn()}
        getCategoryLabel={(value) => value.toUpperCase()}
        allLabel="All"
        ariaLabel="Exercise category"
      />
    );
    expect(screen.getByRole('combobox', { name: 'Exercise category' })).toHaveClass('w-full');
    expect(screen.getByRole('option', { name: 'CHEST' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'CHEST' })).toBeInTheDocument();
  });

  it('reports changes from both responsive controls', () => {
    const onChange = vi.fn();
    render(
      <ExerciseCategorySelector
        value=""
        categories={['chest']}
        onChange={onChange}
        getCategoryLabel={(value) => value}
        allLabel="All"
        ariaLabel="Category"
      />
    );
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'chest' } });
    fireEvent.click(screen.getByRole('button', { name: 'chest' }));
    expect(onChange).toHaveBeenNthCalledWith(1, 'chest');
    expect(onChange).toHaveBeenNthCalledWith(2, 'chest');
  });
});
