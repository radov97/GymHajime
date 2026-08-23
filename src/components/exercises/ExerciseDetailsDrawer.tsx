'use client';

import { useEffect, useState } from 'react';
import { Bookmark, ChevronLeft, ChevronRight, ImageIcon, X } from 'lucide-react';
import { formatCategory, type Exercise } from '@/lib/exercises';

// The JavaScript unmount delay must match Tailwind's `duration-300` transition duration.
const DRAWER_TRANSITION_MS = 300;

/** Data and actions supplied by the parent Exercises page. */
interface Props {
  exercise: Exercise | null;
  saved: boolean;
  saving: boolean;
  onClose: () => void;
  onToggleSave: () => void;
  labels: { close: string; previous: string; next: string; save: string; remove: string };
}

/**
 * Displays complete exercise information in an animated right-side panel.
 *
 * The parent controls whether the drawer is open by passing an exercise or `null`. Internally, the
 * component keeps the last exercise rendered for 300 ms after close so the exit animation can
 * finish before the dialog leaves the DOM. It also owns carousel navigation and autoplay state.
 */
export default function ExerciseDetailsDrawer({
  exercise,
  saved,
  saving,
  onClose,
  onToggleSave,
  labels,
}: Props) {
  // `imageIndex` identifies the image currently visible in the three-image carousel.
  const [imageIndex, setImageIndex] = useState(0);

  // These two states separate visible content from the parent's open/closed prop. That separation
  // is what makes an exit animation possible: content remains rendered while visibility fades out.
  const [renderedExercise, setRenderedExercise] = useState<Exercise | null>(exercise);
  const [isVisible, setIsVisible] = useState(false);

  /**
   * Coordinates mounting and delayed unmounting.
   *
   * On open, requestAnimationFrame lets the browser first render the hidden starting position and
   * then transition to visible. On close, the panel transitions out immediately and its retained
   * exercise is removed only after the CSS duration. Cleanup prevents stale frame/timer callbacks.
   */
  useEffect(() => {
    if (exercise) {
      setRenderedExercise(exercise);
      const frame = window.requestAnimationFrame(() => setIsVisible(true));
      return () => window.cancelAnimationFrame(frame);
    }

    setIsVisible(false);
    const timeout = window.setTimeout(() => setRenderedExercise(null), DRAWER_TRANSITION_MS);
    return () => window.clearTimeout(timeout);
  }, [exercise]);

  // A newly selected exercise always begins its gallery at the first image.
  useEffect(() => setImageIndex(0), [exercise?.id]);

  /**
   * Advances the carousel every two seconds while an exercise with multiple images is open.
   * A manual previous/next/dot selection only changes the index; it does not disable this interval.
   * React clears the interval when the exercise changes, closes, or the component unmounts.
   */
  useEffect(() => {
    if (!exercise || exercise.images.length <= 1) return;

    const interval = window.setInterval(() => {
      setImageIndex((current) => (current + 1) % exercise.images.length);
    }, 2000);

    return () => window.clearInterval(interval);
  }, [exercise]);

  /** Adds conventional Escape-key dialog behavior and removes the listener during cleanup. */
  useEffect(() => {
    if (!exercise) return;
    const listener = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [exercise, onClose]);

  // Nothing is rendered before the drawer opens or after its closing transition has completed.
  if (!renderedExercise) return null;

  const image = renderedExercise.images[imageIndex];

  /**
   * Moves through the gallery in either direction and wraps at both ends.
   * Adding the image count before modulo keeps the previous direction positive at index zero.
   */
  const changeImage = (step: number) =>
    setImageIndex(
      (current) =>
        (current + step + renderedExercise.images.length) % renderedExercise.images.length
    );
  return (
    // Opacity animates the entire dialog/backdrop while the aside below adds horizontal movement.
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 motion-reduce:transition-none ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="exercise-details-title"
    >
      <button
        type="button"
        aria-label={labels.close}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/35"
      />
      {/* The panel independently slides along the x-axis during the same 300 ms window. */}
      <aside
        className={`absolute inset-y-0 right-0 w-full max-w-xl overflow-y-auto bg-[var(--color-brand-soft)] p-7 shadow-2xl transition-transform duration-300 ease-out motion-reduce:transition-none ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="mb-6 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600">
            {formatCategory(renderedExercise.category)}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label={labels.close}
            className="cursor-pointer rounded-full bg-white p-2 text-neutral-700 shadow-sm hover:text-orange-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <h2 id="exercise-details-title" className="text-3xl font-bold text-neutral-950">
          {renderedExercise.name}
        </h2>
        <div className="relative mt-6 aspect-[4/3] overflow-hidden rounded-2xl border border-orange-100 bg-white">
          {/* The key remounts the image when its path changes, replaying its CSS transition. */}
          {image ? (
            <img
              key={image.image_path}
              src={image.url}
              alt={`${renderedExercise.name} ${imageIndex + 1}`}
              className="exercise-carousel-image h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-orange-300">
              <ImageIcon className="h-12 w-12" />
            </div>
          )}
          {renderedExercise.images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => changeImage(-1)}
                aria-label={labels.previous}
                className="absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-white/90 p-2 shadow"
              >
                <ChevronLeft />
              </button>
              <button
                type="button"
                onClick={() => changeImage(1)}
                aria-label={labels.next}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-white/90 p-2 shadow"
              >
                <ChevronRight />
              </button>
            </>
          )}
        </div>
        {/* Dots provide direct navigation and indicate the current gallery position. */}
        {renderedExercise.images.length > 1 && (
          <div className="mt-3 flex justify-center gap-2">
            {renderedExercise.images.map((item, index) => (
              <button
                key={item.image_path}
                type="button"
                onClick={() => setImageIndex(index)}
                aria-label={`${labels.next} ${index + 1}`}
                className={`h-2.5 w-2.5 cursor-pointer rounded-full ${index === imageIndex ? 'bg-orange-500' : 'bg-orange-200'}`}
              />
            ))}
          </div>
        )}
        <p className="mt-7 whitespace-pre-line leading-7 text-neutral-700">
          {renderedExercise.description || '—'}
        </p>
        <button
          type="button"
          disabled={saving}
          onClick={onToggleSave}
          className="mt-8 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-bold text-white shadow-sm transition hover:bg-orange-600 disabled:cursor-wait disabled:opacity-60"
        >
          <Bookmark className="h-5 w-5" fill={saved ? 'currentColor' : 'none'} />
          {saved ? labels.remove : labels.save}
        </button>
      </aside>
    </div>
  );
}
