import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react';
import Image from 'next/image';
import type { ReactElement } from 'react';
import type { WorkoutExercise } from '@/types/workouts';

interface Props {
  exercises: WorkoutExercise[];
  categoryLabel: (category: string) => string;
  labels: Record<string, string>;
  onUpdate: (index: number, patch: Partial<WorkoutExercise>) => void;
  onMove: (index: number, direction: -1 | 1) => void;
  onRemove: (index: number) => void;
}

/** Editable desktop table for exercise prescription values, ordering, and removal. */
export default function WorkoutExerciseTable({
  exercises,
  categoryLabel,
  labels,
  onUpdate,
  onMove,
  onRemove,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
      <table className="w-full table-fixed text-left">
        <thead className="bg-[var(--color-brand)] text-xs uppercase tracking-wide text-[var(--color-brand-soft)]">
          <tr>
            <th className="w-[42%] px-5 py-4">{labels.exercise}</th>
            <th className="w-[12%] px-3 py-4">{labels.sets}</th>
            <th className="w-[12%] px-3 py-4">{labels.reps}</th>
            <th className="w-[15%] px-3 py-4">{labels.weight}</th>
            <th className="px-3 py-4">{labels.actions}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-orange-100">
          {exercises.map((exercise, index) => (
            <tr key={exercise.exerciseId}>
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  {exercise.imageUrl ? (
                    <Image
                      src={exercise.imageUrl}
                      alt=""
                      width={56}
                      height={56}
                      className="h-14 w-14 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-lg bg-orange-50" />
                  )}
                  <div>
                    <strong className="block text-neutral-900">{exercise.name}</strong>
                    <span className="text-sm text-neutral-500">
                      {categoryLabel(exercise.category)}
                    </span>
                  </div>
                </div>
              </td>
              <td className="px-3">
                <NumberInput
                  label={`${exercise.name} ${labels.sets}`}
                  value={exercise.sets}
                  min={1}
                  step={1}
                  onChange={(value) => onUpdate(index, { sets: value })}
                />
              </td>
              <td className="px-3">
                <NumberInput
                  label={`${exercise.name} ${labels.reps}`}
                  value={exercise.reps}
                  min={1}
                  step={1}
                  onChange={(value) => onUpdate(index, { reps: value })}
                />
              </td>
              <td className="px-3">
                <input
                  aria-label={`${exercise.name} ${labels.weight}`}
                  type="number"
                  min="0"
                  step="0.25"
                  value={exercise.weight ?? ''}
                  placeholder="—"
                  onChange={(event) =>
                    onUpdate(index, {
                      weight: event.target.value === '' ? null : Number(event.target.value),
                    })
                  }
                  className="w-24 rounded-lg border border-neutral-200 px-3 py-2 outline-none focus:border-orange-500"
                />
              </td>
              <td className="px-3">
                <div className="flex gap-1">
                  <IconButton
                    label={labels.up}
                    disabled={index === 0}
                    onClick={() => onMove(index, -1)}
                  >
                    <ArrowUp />
                  </IconButton>
                  <IconButton
                    label={labels.down}
                    disabled={index === exercises.length - 1}
                    onClick={() => onMove(index, 1)}
                  >
                    <ArrowDown />
                  </IconButton>
                  <IconButton label={labels.remove} onClick={() => onRemove(index)} danger>
                    <Trash2 />
                  </IconButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function NumberInput({
  label,
  value,
  min,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <input
      aria-label={label}
      type="number"
      value={value}
      min={min}
      step={step}
      onChange={(event) => onChange(Number(event.target.value))}
      className="w-20 rounded-lg border border-neutral-200 px-3 py-2 outline-none focus:border-orange-500"
    />
  );
}

function IconButton({
  label,
  disabled,
  onClick,
  danger,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  danger?: boolean;
  children: ReactElement;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={`cursor-pointer rounded-lg p-2 disabled:cursor-not-allowed disabled:opacity-25 ${danger ? 'text-red-500 hover:bg-red-50' : 'text-neutral-500 hover:bg-orange-50 hover:text-orange-600'}`}
    >
      {children}
    </button>
  );
}
