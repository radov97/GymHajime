import { Plus, Search, X } from 'lucide-react';
import Image from 'next/image';
import TextInput from '@/components/TextInput';
import type { Exercise } from '@/types/exercises';

interface Props {
  open: boolean;
  exercises: Exercise[];
  hasSavedExercises: boolean;
  search: string;
  categoryLabel: (category: string) => string;
  labels: Record<string, string>;
  onSearchChange: (value: string) => void;
  onAdd: (exercise: Exercise) => void;
  onClose: () => void;
}

/** Desktop picker for searching and adding exercises from the user's saved library. */
export default function SavedExercisePicker({
  open,
  exercises,
  hasSavedExercises,
  search,
  categoryLabel,
  labels,
  onSearchChange,
  onAdd,
  onClose,
}: Props) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-8"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-exercise-title"
        className="max-h-[78vh] w-[720px] overflow-hidden rounded-2xl bg-[var(--color-brand-soft)] shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-orange-100 px-6 py-5">
          <h2 id="add-exercise-title" className="text-xl font-bold text-[var(--color-brand-ink)]">
            {labels.add}
          </h2>
          <button
            type="button"
            aria-label={labels.close}
            onClick={onClose}
            className="cursor-pointer rounded-lg p-2 hover:bg-orange-100"
          >
            <X />
          </button>
        </div>
        <div className="p-6">
          <TextInput
            type="search"
            autoFocus
            value={search}
            onChange={onSearchChange}
            ariaLabel={labels.search}
            placeholder={labels.search}
            leadingIcon={<Search className="h-5 w-5" />}
          />
          <div className="mt-4 max-h-[50vh] space-y-2 overflow-y-auto">
            {exercises.length ? (
              exercises.map((exercise) => (
                <button
                  key={exercise.id}
                  type="button"
                  onClick={() => onAdd(exercise)}
                  className="flex w-full cursor-pointer items-center gap-4 rounded-xl border border-transparent bg-white p-3 text-left hover:border-orange-300 hover:bg-orange-50"
                >
                  {exercise.images[0] ? (
                    <Image
                      src={exercise.images[0].url}
                      alt=""
                      width={56}
                      height={56}
                      className="h-14 w-14 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-lg bg-orange-50" />
                  )}
                  <span>
                    <strong className="block">{exercise.name}</strong>
                    <span className="text-sm text-neutral-500">
                      {categoryLabel(exercise.category)}
                    </span>
                  </span>
                  <Plus className="ml-auto text-orange-500" />
                </button>
              ))
            ) : (
              <p className="py-12 text-center text-neutral-500">
                {hasSavedExercises ? labels.noMatches : labels.noSaved}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
