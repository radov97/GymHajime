import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import WorkoutExerciseTable from './WorkoutExerciseTable';
import type { WorkoutExercise } from '@/types/workouts';

const exercises: WorkoutExercise[] = [
  {
    id: '1',
    exerciseId: 'bench',
    name: 'Bench Press',
    category: 'chest',
    imageUrl: null,
    sets: 4,
    reps: 8,
    weight: 60,
    durationMinutes: null,
    sortOrder: 1,
  },
  {
    id: '2',
    exerciseId: 'fly',
    name: 'Cable Fly',
    category: 'chest',
    imageUrl: null,
    sets: 3,
    reps: 12,
    weight: null,
    durationMinutes: null,
    sortOrder: 2,
  },
];
const labels = {
  exercise: 'Exercise',
  sets: 'Sets',
  reps: 'Reps',
  weight: 'Weight',
  duration: 'Duration (minutes)',
  actions: 'Actions',
  up: 'Move up',
  down: 'Move down',
  remove: 'Remove',
};

describe('WorkoutExerciseTable', () => {
  it('renders exercise prescription data and localized categories', () => {
    render(
      <WorkoutExerciseTable
        exercises={exercises}
        categoryLabel={() => 'Chest'}
        labels={labels}
        onUpdate={vi.fn()}
        onMove={vi.fn()}
        onRemove={vi.fn()}
      />
    );
    expect(screen.getByText('Bench Press')).toBeInTheDocument();
    expect(screen.getAllByText('Chest')).toHaveLength(2);
    expect(screen.getByRole('spinbutton', { name: 'Bench Press Sets' })).toHaveValue(4);
    expect(screen.getByRole('spinbutton', { name: 'Cable Fly Weight' })).toHaveValue(null);
  });

  it('reports value changes, ordering, and removal', () => {
    const onUpdate = vi.fn();
    const onMove = vi.fn();
    const onRemove = vi.fn();
    render(
      <WorkoutExerciseTable
        exercises={exercises}
        categoryLabel={(value) => value}
        labels={labels}
        onUpdate={onUpdate}
        onMove={onMove}
        onRemove={onRemove}
      />
    );
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Bench Press Sets' }), {
      target: { value: '5' },
    });
    fireEvent.click(screen.getAllByRole('button', { name: 'Move down' })[0]);
    fireEvent.click(screen.getAllByRole('button', { name: 'Remove' })[1]);
    expect(onUpdate).toHaveBeenCalledWith(0, { sets: 5 });
    expect(onMove).toHaveBeenCalledWith(0, 1);
    expect(onRemove).toHaveBeenCalledWith(1);
  });

  it('opens exercise details from its image and text area', () => {
    const onOpenExercise = vi.fn();
    render(
      <WorkoutExerciseTable
        exercises={exercises}
        categoryLabel={() => 'Chest'}
        labels={labels}
        onUpdate={vi.fn()}
        onMove={vi.fn()}
        onRemove={vi.fn()}
        onOpenExercise={onOpenExercise}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /Bench Press\s*Chest/i }));
    expect(onOpenExercise).toHaveBeenCalledWith(exercises[0]);
  });

  it('replaces strength fields with duration for cardio exercises', () => {
    const onUpdate = vi.fn();
    const cardio: WorkoutExercise = {
      ...exercises[0],
      exerciseId: 'run',
      name: 'Treadmill Run',
      category: 'cardio',
      sets: null,
      reps: null,
      weight: null,
      durationMinutes: 20,
    };
    render(
      <WorkoutExerciseTable
        exercises={[cardio]}
        categoryLabel={() => 'Cardio'}
        labels={labels}
        onUpdate={onUpdate}
        onMove={vi.fn()}
        onRemove={vi.fn()}
      />
    );
    expect(
      screen.queryByRole('spinbutton', { name: 'Treadmill Run Sets' })
    ).not.toBeInTheDocument();
    const duration = screen.getByRole('spinbutton', {
      name: 'Treadmill Run Duration (minutes)',
    });
    expect(duration).toHaveValue(20);
    fireEvent.change(duration, { target: { value: '35' } });
    expect(onUpdate).toHaveBeenCalledWith(0, { durationMinutes: 35 });
  });

  it('disables ordering controls at the table boundaries', () => {
    render(
      <WorkoutExerciseTable
        exercises={exercises}
        categoryLabel={(value) => value}
        labels={labels}
        onUpdate={vi.fn()}
        onMove={vi.fn()}
        onRemove={vi.fn()}
      />
    );
    expect(screen.getAllByRole('button', { name: 'Move up' })[0]).toBeDisabled();
    expect(screen.getAllByRole('button', { name: 'Move down' })[1]).toBeDisabled();
  });
});
