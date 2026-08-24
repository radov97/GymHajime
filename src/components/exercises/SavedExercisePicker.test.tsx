import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { exerciseFixture } from '@/dummy/exerciseFixture';
import SavedExercisePicker from './SavedExercisePicker';

const labels = {
  add: 'Add Exercise',
  close: 'Close picker',
  search: 'Search saved exercises',
  noMatches: 'No matches',
  noSaved: 'No saved exercises',
};

describe('SavedExercisePicker', () => {
  it('renders nothing while closed', () => {
    const { container } = render(
      <SavedExercisePicker
        open={false}
        exercises={[]}
        hasSavedExercises={false}
        search=""
        categoryLabel={(value) => value}
        labels={labels}
        onSearchChange={vi.fn()}
        onAdd={vi.fn()}
        onClose={vi.fn()}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('searches and adds an exercise without closing until requested', () => {
    const onSearchChange = vi.fn();
    const onAdd = vi.fn();
    const onClose = vi.fn();
    render(
      <SavedExercisePicker
        open
        exercises={[exerciseFixture]}
        hasSavedExercises
        search=""
        categoryLabel={() => 'Chest'}
        labels={labels}
        onSearchChange={onSearchChange}
        onAdd={onAdd}
        onClose={onClose}
      />
    );
    expect(screen.getByRole('dialog', { name: 'Add Exercise' })).toBeInTheDocument();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'bench' } });
    fireEvent.click(screen.getByRole('button', { name: /Barbell Bench Press/ }));
    expect(screen.getByRole('dialog', { name: 'Add Exercise' })).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Close picker' }));
    expect(onSearchChange).toHaveBeenCalledWith('bench');
    expect(onAdd).toHaveBeenCalledWith(exerciseFixture);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('distinguishes an empty library from a search with no matches', () => {
    const { rerender } = render(
      <SavedExercisePicker
        open
        exercises={[]}
        hasSavedExercises={false}
        search=""
        categoryLabel={(value) => value}
        labels={labels}
        onSearchChange={vi.fn()}
        onAdd={vi.fn()}
        onClose={vi.fn()}
      />
    );
    expect(screen.getByText('No saved exercises')).toBeInTheDocument();
    rerender(
      <SavedExercisePicker
        open
        exercises={[]}
        hasSavedExercises
        search="missing"
        categoryLabel={(value) => value}
        labels={labels}
        onSearchChange={vi.fn()}
        onAdd={vi.fn()}
        onClose={vi.fn()}
      />
    );
    expect(screen.getByText('No matches')).toBeInTheDocument();
  });
});
