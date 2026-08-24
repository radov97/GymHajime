import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithIntl } from '@/test/render';
import WorkoutDayModal from './WorkoutDayModal';
import type { Workout } from '@/types/workouts';

const workout: Workout = {
  id: 'monday',
  dayOfWeek: 1,
  name: 'Mixed Training',
  exercises: [
    {
      id: 'strength-row',
      exerciseId: 'bench',
      name: 'Bench Press',
      category: 'chest',
      imageUrl: null,
      sets: 4,
      reps: 8,
      weight: 60,
      durationMinutes: null,
      sortOrder: 1,
      details: {
        id: 'bench',
        name: 'Bench Press',
        category: 'chest',
        description: 'A compound chest exercise.',
        images: [1, 2, 3].map((number) => ({
          image_path: `bench-${number}.jpg`,
          sort_order: number,
          url: `/bench-${number}.jpg`,
        })),
      },
    },
    {
      id: 'cardio-row',
      exerciseId: 'run',
      name: 'Treadmill Run',
      category: 'cardio',
      imageUrl: null,
      sets: null,
      reps: null,
      weight: null,
      durationMinutes: 25,
      sortOrder: 2,
    },
  ],
};

describe('WorkoutDayModal', () => {
  it('shows ordered strength and cardio prescriptions and closes', () => {
    const onClose = vi.fn();
    renderWithIntl(<WorkoutDayModal workout={workout} day="Monday" onClose={onClose} />);
    expect(screen.getByRole('dialog', { name: 'Mixed Training' })).toHaveClass('!max-w-4xl');
    expect(screen.getByText('Monday · 2 exercises')).toBeInTheDocument();
    expect(screen.getByText('4 × 8')).toBeInTheDocument();
    expect(screen.getByText('60 kg')).toBeInTheDocument();
    expect(screen.getByText('25 min')).toBeInTheDocument();
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('02')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Bench Press/i }));
    expect(screen.getByRole('dialog', { name: 'Bench Press' })).toBeInTheDocument();
    expect(screen.getByText('A compound chest exercise.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Next image' }));
    expect(screen.getByRole('img', { name: 'Bench Press 2' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Back to workout' }));
    expect(screen.getByRole('dialog', { name: 'Mixed Training' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Close workout details' }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
