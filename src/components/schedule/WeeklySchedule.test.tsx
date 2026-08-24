import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithIntl } from '@/test/render';
import WeeklySchedule from './WeeklySchedule';
import type { Workout } from '@/types/workouts';

vi.mock('@/api/workouts', () => ({ getWeeklySchedule: vi.fn() }));

const monday: Workout = {
  id: 'workout-1',
  dayOfWeek: 1,
  name: 'Push Day',
  exercises: [
    {
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
    },
  ],
};

describe('WeeklySchedule', () => {
  it('renders configured workouts and unconfigured weekdays as rest days', async () => {
    renderWithIntl(<WeeklySchedule loadSchedule={vi.fn(async () => ({ workouts: [monday] }))} />);
    expect(await screen.findByRole('heading', { name: 'Push Day' })).toBeInTheDocument();
    expect(screen.getByText('Bench Press')).toBeInTheDocument();
    expect(screen.getByText('4 × 8')).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { name: 'Rest day' })).toHaveLength(6);
    expect(screen.getByText('training day')).toBeInTheDocument();
    const rail = screen.getByRole('region', { name: 'Weekly workout schedule' });
    const scrollBy = vi.fn();
    Object.defineProperties(rail, {
      clientWidth: { configurable: true, value: 320 },
      scrollWidth: { configurable: true, value: 1000 },
      scrollLeft: { configurable: true, value: 0, writable: true },
      scrollBy: { configurable: true, value: scrollBy },
    });
    fireEvent.scroll(rail);
    const nextDays = screen.getByRole('button', { name: 'Next days' });
    expect(nextDays).toBeEnabled();
    fireEvent.click(nextDays);
    expect(scrollBy).toHaveBeenCalledWith({ left: 340, behavior: 'smooth' });
    fireEvent.click(screen.getByRole('button', { name: 'View Monday workout' }));
    expect(screen.getByRole('dialog', { name: 'Push Day' })).toBeInTheDocument();
    expect(screen.getByText('60 kg')).toBeInTheDocument();
  });

  it('renders duration for cardio prescriptions', async () => {
    const cardio: Workout = {
      ...monday,
      name: 'Cardio Day',
      exercises: [
        {
          ...monday.exercises[0],
          name: 'Treadmill Run',
          category: 'cardio',
          sets: null,
          reps: null,
          weight: null,
          durationMinutes: 30,
        },
      ],
    };
    renderWithIntl(<WeeklySchedule loadSchedule={vi.fn(async () => ({ workouts: [cardio] }))} />);
    expect(await screen.findByText('30 min')).toBeInTheDocument();
  });
});
