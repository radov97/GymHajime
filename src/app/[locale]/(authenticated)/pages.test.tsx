import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithIntl } from '../../../test/render';
import DashboardPage from './dashboard/page';
import DiscoverPage from './discover/page';
import ExercisesPage from './exercises/page';
import HistoryPage from './history/page';
import ProgressPage from './progress/page';
import SchedulePage from './schedule/page';
import SettingsPage from './settings/page';

vi.mock('@/api/exercises', () => ({
  getExercises: () =>
    Promise.resolve({ exercises: [], categories: [], total: 0, page: 1, limit: 24 }),
}));
vi.mock('@/api/savedExercises', () => ({
  getSavedExercises: () => Promise.resolve({ exercises: [] }),
  saveExercise: vi.fn(),
  deleteSavedExercise: vi.fn(),
}));
vi.mock('@/api/workouts', () => ({
  getWorkout: () => Promise.resolve({ workout: null }),
  saveWorkout: vi.fn(),
  clearWorkout: vi.fn(),
  moveWorkout: vi.fn(),
}));

describe('authenticated placeholder pages', () => {
  it.each([
    ['Dashboard', DashboardPage],
    ['Discover', DiscoverPage],
    ['Workout History', HistoryPage],
    ['Progress', ProgressPage],
    ['My Schedule', SchedulePage],
    ['Settings', SettingsPage],
  ])('renders the %s page heading', (heading, Page) => {
    renderWithIntl(<Page />);
    expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
  });

  it('renders Exercises without a redundant page heading', () => {
    renderWithIntl(<ExercisesPage />);
    expect(screen.queryByRole('heading', { name: 'Exercises' })).not.toBeInTheDocument();
    expect(screen.getByRole('tablist', { name: 'Exercises' })).toBeInTheDocument();
  });
});
