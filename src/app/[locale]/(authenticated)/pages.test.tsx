import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithIntl } from '../../../test/render';
import DashboardPage from './dashboard/page';
import DiscoverPage from './discover/page';
import ExercisesPage from './exercises/page';
import HistoryPage from './history/page';
import ProgressPage from './progress/page';
import SchedulePage from './schedule/page';
import SettingsPage from './settings/page';

describe('authenticated placeholder pages', () => {
  it.each([
    ['Dashboard', DashboardPage],
    ['Discover', DiscoverPage],
    ['Exercises', ExercisesPage],
    ['Workout History', HistoryPage],
    ['Progress', ProgressPage],
    ['My Schedule', SchedulePage],
    ['Settings', SettingsPage],
  ])('renders the %s page heading', (heading, Page) => {
    renderWithIntl(<Page />);
    expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
  });
});
