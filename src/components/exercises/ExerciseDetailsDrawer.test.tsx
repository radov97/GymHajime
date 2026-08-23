import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ExerciseDetailsDrawer from './ExerciseDetailsDrawer';
import type { Exercise } from '@/lib/exercises';

const exercise: Exercise = {
  id: '1',
  name: 'Bench Press',
  category: 'chest',
  description: 'Press the bar upward.',
  images: [1, 2, 3].map((number) => ({
    image_path: `1/${number}.webp`,
    sort_order: number,
    url: `/image-${number}.webp`,
  })),
};
const labels = {
  close: 'Close details',
  previous: 'Previous image',
  next: 'Next image',
  save: 'Add exercise',
  remove: 'Remove exercise',
};

describe('ExerciseDetailsDrawer', () => {
  it('renders nothing without an exercise', () => {
    const { container } = render(
      <ExerciseDetailsDrawer
        exercise={null}
        saved={false}
        saving={false}
        onClose={vi.fn()}
        onToggleSave={vi.fn()}
        labels={labels}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('shows details, advances the gallery, and saves', () => {
    const onToggleSave = vi.fn();
    render(
      <ExerciseDetailsDrawer
        exercise={exercise}
        saved={false}
        saving={false}
        onClose={vi.fn()}
        onToggleSave={onToggleSave}
        labels={labels}
      />
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByAltText('Bench Press 1')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Next image' }));
    expect(screen.getByAltText('Bench Press 2')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Add exercise' }));
    expect(onToggleSave).toHaveBeenCalledOnce();
  });

  it('closes with Escape', () => {
    const onClose = vi.fn();
    render(
      <ExerciseDetailsDrawer
        exercise={exercise}
        saved={false}
        saving={false}
        onClose={onClose}
        onToggleSave={vi.fn()}
        labels={labels}
      />
    );
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
  });
});
