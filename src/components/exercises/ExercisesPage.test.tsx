import { fireEvent, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithIntl } from '@/test/render';
import ExercisesPage from './ExercisesPage';

vi.mock('@/api/exercises', () => ({
  getExercises: () =>
    Promise.resolve({ exercises: [], categories: ['chest'], total: 0, page: 1, limit: 24 }),
}));
vi.mock('@/api/savedExercises', () => ({
  getSavedExercises: () => Promise.resolve({ exercises: [] }),
  saveExercise: vi.fn(),
  deleteSavedExercise: vi.fn(),
}));

describe('ExercisesPage', () => {
  it('renders the explore controls and no-results state', async () => {
    renderWithIntl(<ExercisesPage />);
    expect(screen.getByRole('heading', { name: 'Exercises' })).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: 'Search exercises...' })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('No exercises found.')).toBeInTheDocument());
  });

  it('shows the My Exercises empty state', async () => {
    renderWithIntl(<ExercisesPage />);
    fireEvent.click(screen.getByRole('tab', { name: 'My Exercises' }));
    expect(await screen.findByText('No saved exercises yet.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Explore exercises' }));
    expect(screen.getByRole('tab', { name: 'Explore Exercises' })).toHaveAttribute(
      'aria-selected',
      'true'
    );
  });
});
