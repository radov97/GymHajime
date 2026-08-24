import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { WorkoutExercise } from '@/types/workouts';
import WorkoutExerciseIdentity from './WorkoutExerciseIdentity';

const exercise: WorkoutExercise = {
  id: 'row-1',
  exerciseId: 'bench',
  name: 'Bench Press',
  category: 'chest',
  imageUrl: null,
  sets: 4,
  reps: 8,
  weight: 60,
  durationMinutes: null,
  sortOrder: 1,
};

describe('WorkoutExerciseIdentity', () => {
  it('renders an interactive exercise identity and reports selection', () => {
    const onClick = vi.fn();
    render(
      <WorkoutExerciseIdentity
        exercise={exercise}
        categoryLabel="Chest"
        trailing={<span>4 × 8</span>}
        onClick={onClick}
      />
    );

    const trigger = screen.getByRole('button', { name: /Bench Press\s*Chest\s*4 × 8/i });
    expect(trigger).toHaveClass('hover:bg-orange-50', 'focus-visible:ring-2');
    fireEvent.click(trigger);
    expect(onClick).toHaveBeenCalledOnce();
  });
});
