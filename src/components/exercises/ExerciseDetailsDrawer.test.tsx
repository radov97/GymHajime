import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
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

afterEach(() => {
  vi.useRealTimers();
  document.body.style.removeProperty('overflow');
});

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
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveClass('items-center', 'justify-center', 'md:block');
    expect(dialog.querySelector('aside')).toHaveClass('rounded-2xl', 'md:rounded-none');
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

  it('automatically advances to the next image every two seconds', () => {
    vi.useFakeTimers();
    render(
      <ExerciseDetailsDrawer
        exercise={exercise}
        saved={false}
        saving={false}
        onClose={vi.fn()}
        onToggleSave={vi.fn()}
        labels={labels}
      />
    );

    expect(screen.getByAltText('Bench Press 1')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(2000));
    expect(screen.getByAltText('Bench Press 2')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(2000));
    expect(screen.getByAltText('Bench Press 3')).toBeInTheDocument();
  });

  it('keeps the drawer mounted until its closing transition finishes', () => {
    vi.useFakeTimers();
    const { rerender } = render(
      <ExerciseDetailsDrawer
        exercise={exercise}
        saved={false}
        saving={false}
        onClose={vi.fn()}
        onToggleSave={vi.fn()}
        labels={labels}
      />
    );

    rerender(
      <ExerciseDetailsDrawer
        exercise={null}
        saved={false}
        saving={false}
        onClose={vi.fn()}
        onToggleSave={vi.fn()}
        labels={labels}
      />
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(300));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('locks page scrolling through the exit animation and then restores it', () => {
    vi.useFakeTimers();
    document.body.style.overflow = 'scroll';
    const { rerender } = render(
      <ExerciseDetailsDrawer
        exercise={exercise}
        saved={false}
        saving={false}
        onClose={vi.fn()}
        onToggleSave={vi.fn()}
        labels={labels}
      />
    );
    expect(document.body.style.overflow).toBe('hidden');

    rerender(
      <ExerciseDetailsDrawer
        exercise={null}
        saved={false}
        saving={false}
        onClose={vi.fn()}
        onToggleSave={vi.fn()}
        labels={labels}
      />
    );
    expect(document.body.style.overflow).toBe('hidden');
    act(() => vi.advanceTimersByTime(300));
    expect(document.body.style.overflow).toBe('scroll');
  });

  it('restores page scrolling when an open drawer unmounts', () => {
    document.body.style.overflow = 'auto';
    const { unmount } = render(
      <ExerciseDetailsDrawer
        exercise={exercise}
        saved={false}
        saving={false}
        onClose={vi.fn()}
        onToggleSave={vi.fn()}
        labels={labels}
      />
    );
    unmount();
    expect(document.body.style.overflow).toBe('auto');
  });
});
