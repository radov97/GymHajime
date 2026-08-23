import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ExerciseFilters from './ExerciseFilters';

const labels = {
  search: 'Search exercises',
  clear: 'Clear search',
  all: 'All',
  category: 'Exercise category',
};

describe('ExerciseFilters', () => {
  it('reports search and category changes', () => {
    const onSearchChange = vi.fn();
    const onCategoryChange = vi.fn();
    render(
      <ExerciseFilters
        search="bench"
        onSearchChange={onSearchChange}
        categories={['chest', 'upper_back']}
        category=""
        onCategoryChange={onCategoryChange}
        labels={labels}
      />
    );
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'squat' } });
    fireEvent.click(screen.getByRole('button', { name: 'Upper Back' }));
    expect(onSearchChange).toHaveBeenCalledWith('squat');
    expect(onCategoryChange).toHaveBeenCalledWith('upper_back');
  });

  it('clears a populated search', () => {
    const onSearchChange = vi.fn();
    render(
      <ExerciseFilters
        search="bench"
        onSearchChange={onSearchChange}
        categories={[]}
        category=""
        onCategoryChange={vi.fn()}
        labels={labels}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(onSearchChange).toHaveBeenCalledWith('');
  });

  it('changes category from the mobile dropdown', () => {
    const onCategoryChange = vi.fn();
    render(
      <ExerciseFilters
        search=""
        onSearchChange={vi.fn()}
        categories={['chest', 'back']}
        category=""
        onCategoryChange={onCategoryChange}
        labels={labels}
      />
    );
    fireEvent.change(screen.getByRole('combobox', { name: 'Exercise category' }), {
      target: { value: 'back' },
    });
    expect(onCategoryChange).toHaveBeenCalledWith('back');
  });
});
