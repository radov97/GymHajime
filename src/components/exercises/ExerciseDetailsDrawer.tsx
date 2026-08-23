'use client';

import { useEffect, useState } from 'react';
import { Bookmark, ChevronLeft, ChevronRight, ImageIcon, X } from 'lucide-react';
import { formatCategory, type Exercise } from '@/lib/exercises';

interface Props {
  exercise: Exercise | null;
  saved: boolean;
  saving: boolean;
  onClose: () => void;
  onToggleSave: () => void;
  labels: { close: string; previous: string; next: string; save: string; remove: string };
}

export default function ExerciseDetailsDrawer({
  exercise,
  saved,
  saving,
  onClose,
  onToggleSave,
  labels,
}: Props) {
  const [imageIndex, setImageIndex] = useState(0);
  useEffect(() => setImageIndex(0), [exercise?.id]);
  useEffect(() => {
    if (!exercise) return;
    const listener = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [exercise, onClose]);
  if (!exercise) return null;
  const image = exercise.images[imageIndex];
  const changeImage = (step: number) =>
    setImageIndex((current) => (current + step + exercise.images.length) % exercise.images.length);
  return (
    <div
      className="fixed inset-0 z-50"
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
      <aside className="absolute inset-y-0 right-0 w-full max-w-xl overflow-y-auto bg-[var(--color-brand-soft)] p-7 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600">
            {formatCategory(exercise.category)}
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
          {exercise.name}
        </h2>
        <div className="relative mt-6 aspect-[4/3] overflow-hidden rounded-2xl border border-orange-100 bg-white">
          {image ? (
            <img
              src={image.url}
              alt={`${exercise.name} ${imageIndex + 1}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-orange-300">
              <ImageIcon className="h-12 w-12" />
            </div>
          )}
          {exercise.images.length > 1 && (
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
        {exercise.images.length > 1 && (
          <div className="mt-3 flex justify-center gap-2">
            {exercise.images.map((item, index) => (
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
          {exercise.description || '—'}
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
