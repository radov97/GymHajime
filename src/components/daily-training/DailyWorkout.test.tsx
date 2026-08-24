import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithIntl } from '@/test/render';
import type { Workout } from '@/types/workouts';
import DailyWorkout from './DailyWorkout';

vi.mock('@/api/workouts', () => ({ getWeeklySchedule: vi.fn() }));

const monday: Workout = {
  id: 'monday-workout',
  dayOfWeek: 1,
  name: 'Push Day',
  exercises: [
    {
      id: 'bench-row',
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
  ],
};

const tuesday: Workout = {
  ...monday,
  id: 'tuesday-workout',
  dayOfWeek: 2,
  name: 'Cardio Day',
  exercises: [
    {
      ...monday.exercises[0],
      id: 'run-row',
      exerciseId: 'run',
      name: 'Treadmill Run',
      category: 'cardio',
      sets: null,
      reps: null,
      durationMinutes: 30,
    },
  ],
};

describe('DailyWorkout', () => {
  it('starts on today and limits navigation to yesterday and tomorrow', async () => {
    renderWithIntl(
      <DailyWorkout
        today={new Date('2026-08-24T12:00:00')}
        loadSchedule={vi.fn(async () => ({ workouts: [monday, tuesday] }))}
      />
    );

    expect(await screen.findByRole('heading', { name: 'Push Day' })).toBeInTheDocument();
    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('Bench Press')).toBeInTheDocument();
    expect(screen.getByText('4 × 8')).toBeInTheDocument();

    const previous = screen.getAllByRole('button', { name: 'View yesterday' })[0];
    fireEvent.click(previous);
    expect(previous).toBeDisabled();
    expect(screen.getByText('Yesterday')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Rest day' })).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: 'View tomorrow' })[0]);
    expect(screen.getByText('Today')).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('button', { name: 'View tomorrow' })[0]);
    expect(screen.getByText('Tomorrow')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Cardio Day' })).toBeInTheDocument();
    expect(screen.getByText('30 min')).toBeInTheDocument();
    screen
      .getAllByRole('button', { name: 'View tomorrow' })
      .forEach((button) => expect(button).toBeDisabled());
  });

  it('shows an error state and supports retrying', async () => {
    const loadSchedule = vi
      .fn()
      .mockRejectedValueOnce(new Error('Failed'))
      .mockResolvedValueOnce({ workouts: [] });
    renderWithIntl(
      <DailyWorkout today={new Date('2026-08-24T12:00:00')} loadSchedule={loadSchedule} />
    );

    fireEvent.click(await screen.findByRole('button', { name: 'Try again' }));
    expect(await screen.findByRole('heading', { name: 'Rest day' })).toBeInTheDocument();
    expect(loadSchedule).toHaveBeenCalledTimes(2);
  });
});
