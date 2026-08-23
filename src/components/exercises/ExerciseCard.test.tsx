import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ExerciseCard from './ExerciseCard';
import type { Exercise } from '@/lib/exercises';

const exercise: Exercise = {
  id: '1',
  name: 'Bench Press',
  category: 'chest',
  description: 'A chest exercise.',
  images: [{ image_path: '1/1.webp', sort_order: 1, url: '/gymhajime-logo.png' }],
};

describe('ExerciseCard', () => {
  it('renders exercise information and opens its details', () => {
    const onOpen = vi.fn();
    render(
      <ExerciseCard
        exercise={exercise}
        saved={false}
        saving={false}
        onOpen={onOpen}
        onToggleSave={vi.fn()}
        saveLabel="Save exercise"
        removeLabel="Remove exercise"
      />
    );
    expect(screen.getByRole('heading', { name: 'Bench Press' })).toBeInTheDocument();
    expect(screen.getByText('Chest')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('heading', { name: 'Bench Press' }));
    expect(onOpen).toHaveBeenCalledOnce();
  });

  it('exposes and invokes the save action', () => {
    const onToggleSave = vi.fn();
    render(
      <ExerciseCard
        exercise={exercise}
        saved
        saving={false}
        onOpen={vi.fn()}
        onToggleSave={onToggleSave}
        saveLabel="Save exercise"
        removeLabel="Remove exercise"
      />
    );
    const button = screen.getByRole('button', { name: 'Remove exercise' });
    expect(button).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(button);
    expect(onToggleSave).toHaveBeenCalledOnce();
  });
});
