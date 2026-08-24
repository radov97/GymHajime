import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import WorkoutBuilder, { type WorkoutBuilderLabels } from './WorkoutBuilder';
import type { Workout } from '@/types/workouts';

vi.mock('@/api/workouts', () => ({
  getWorkout: vi.fn(),
  saveWorkout: vi.fn(),
  clearWorkout: vi.fn(),
  moveWorkout: vi.fn(),
}));

const labels: WorkoutBuilderLabels = {
  builder: 'Workout Builder',
  day: 'Day',
  workoutName: 'Workout name',
  namePlaceholder: 'Name',
  add: 'Add Exercise',
  loading: 'Loading...',
  error: 'Error',
  retry: 'Retry',
  empty: 'No exercises for __DAY__.',
  exercise: 'Exercise',
  sets: 'Sets',
  reps: 'Reps',
  weight: 'Weight',
  actions: 'Actions',
  up: 'Up',
  down: 'Down',
  remove: 'Remove',
  save: 'Save Workout',
  saving: 'Saving...',
  unsaved: 'Unsaved?',
  validation: 'Invalid',
  close: 'Close',
  previous: 'Previous image',
  next: 'Next image',
  search: 'Search',
  noMatches: 'No matches',
  noSaved: 'No saved',
  move: 'Move Workout',
  moveTarget: 'Move to day',
  moveWarning: 'Target will be replaced.',
  confirmMove: 'Move Workout',
  moving: 'Moving...',
  moveUnsaved: 'Save first',
  moveError: 'Move error',
  clear: 'Clear Day',
  clearConfirm: 'Clear __DAY__?',
  clearError: 'Clear error',
  cancel: 'Cancel',
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};
const monday: Workout = {
  id: 'workout-1',
  dayOfWeek: 1,
  name: 'Chest',
  exercises: [
    {
      id: 'row-1',
      exerciseId: 'exercise-1',
      name: 'Bench Press',
      category: 'chest',
      imageUrl: null,
      sets: 4,
      reps: 8,
      weight: 60,
      sortOrder: 1,
    },
  ],
};

describe('WorkoutBuilder persisted actions', () => {
  it('opens persisted exercise details without relying on the saved library', async () => {
    const workoutWithDetails = {
      ...monday,
      exercises: [
        {
          ...monday.exercises[0],
          details: {
            id: 'bench',
            name: 'Bench Press',
            category: 'chest',
            description: 'A compound chest exercise.',
            images: [],
          },
        },
      ],
    };
    render(
      <WorkoutBuilder
        locale="en"
        savedExercises={[]}
        categoryLabel={() => 'Chest'}
        labels={labels}
        loadWorkout={vi.fn(async () => ({ workout: workoutWithDetails }))}
        persistWorkout={vi.fn()}
        clearPersistedWorkout={vi.fn()}
        movePersistedWorkout={vi.fn()}
      />
    );
    fireEvent.click(await screen.findByRole('button', { name: /Bench Press\s*Chest/i }));
    expect(screen.getByRole('dialog', { name: 'Bench Press' })).toBeInTheDocument();
    expect(screen.getByText('A compound chest exercise.')).toBeInTheDocument();
  });

  it('clears the selected persisted workout after confirmation', async () => {
    const clearPersistedWorkout = vi.fn(async () => ({ workout: null }));
    render(
      <WorkoutBuilder
        locale="en"
        savedExercises={[]}
        categoryLabel={(value) => value}
        labels={labels}
        loadWorkout={vi.fn(async () => ({ workout: monday }))}
        persistWorkout={vi.fn()}
        clearPersistedWorkout={clearPersistedWorkout}
        movePersistedWorkout={vi.fn()}
      />
    );
    await screen.findByText('Bench Press');
    fireEvent.click(screen.getByRole('button', { name: 'Clear Day' }));
    expect(screen.getByRole('dialog')).toHaveTextContent('Clear Monday?');
    const clearButtons = screen.getAllByRole('button', { name: 'Clear Day' });
    expect(clearButtons[1]).toHaveClass('border-red-200');
    fireEvent.click(clearButtons[1]);
    await waitFor(() => expect(clearPersistedWorkout).toHaveBeenCalledWith(1));
    expect(await screen.findByText('No exercises for Monday.')).toBeInTheDocument();
  });

  it('moves a persisted workout and switches to the target day', async () => {
    const moved = { ...monday, dayOfWeek: 2 };
    const loadWorkout = vi.fn(async (day: number) => ({ workout: day === 1 ? monday : moved }));
    const movePersistedWorkout = vi.fn(async () => ({ workout: moved }));
    render(
      <WorkoutBuilder
        locale="en"
        savedExercises={[]}
        categoryLabel={(value) => value}
        labels={labels}
        loadWorkout={loadWorkout}
        persistWorkout={vi.fn()}
        clearPersistedWorkout={vi.fn()}
        movePersistedWorkout={movePersistedWorkout}
      />
    );
    await screen.findByText('Bench Press');
    fireEvent.click(screen.getByRole('button', { name: 'Move Workout' }));
    fireEvent.click(screen.getAllByRole('button', { name: 'Move Workout' })[1]);
    await waitFor(() => expect(movePersistedWorkout).toHaveBeenCalledWith(1, 2, 'en'));
    await waitFor(() => expect(screen.getByRole('combobox', { name: 'Day' })).toHaveValue('2'));
  });
});
