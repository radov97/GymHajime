import { ArrowDown, ArrowUp, ChevronRight, Trash2 } from 'lucide-react';
import Image from 'next/image';
import type { WorkoutExercise } from '@/types/workouts';
import IconButton from '@/components/IconButton';

interface Props {
  exercises: WorkoutExercise[];
  categoryLabel: (category: string) => string;
  labels: Record<string, string>;
  onUpdate: (index: number, patch: Partial<WorkoutExercise>) => void;
  onMove: (index: number, direction: -1 | 1) => void;
  onRemove: (index: number) => void;
  onOpenExercise?: (exercise: WorkoutExercise) => void;
}

/** Responsive prescription editor: stacked cards on mobile and the existing table on desktop. */
export default function WorkoutExerciseTable({
  exercises,
  categoryLabel,
  labels,
  onUpdate,
  onMove,
  onRemove,
  onOpenExercise,
}: Props) {
  return (
    <div className="md:overflow-hidden md:rounded-2xl md:border md:border-orange-100 md:bg-white md:shadow-sm">
      <table className="block w-full text-left md:table md:table-fixed">
        <thead className="hidden bg-[var(--color-brand)] text-xs uppercase tracking-wide text-[var(--color-brand-soft)] md:table-header-group">
          <tr>
            <th className="w-[42%] px-5 py-4">{labels.exercise}</th>
            <th className="w-[12%] px-3 py-4">{labels.sets}</th>
            <th className="w-[12%] px-3 py-4">{labels.reps}</th>
            <th className="w-[15%] px-3 py-4">{labels.weight}</th>
            <th className="px-3 py-4">{labels.actions}</th>
          </tr>
        </thead>
        <tbody className="block space-y-4 md:table-row-group md:divide-y md:divide-orange-100 md:space-y-0">
          {exercises.map((exercise, index) => (
            <tr
              key={exercise.exerciseId}
              className="block overflow-hidden rounded-2xl border border-orange-100 bg-white p-4 shadow-sm md:table-row md:rounded-none md:border-0 md:p-0 md:shadow-none"
            >
              <td className="block pb-4 md:table-cell md:px-5 md:py-4">
                <button
                  type="button"
                  onClick={() => onOpenExercise?.(exercise)}
                  className="group/details -m-2 flex w-full cursor-pointer items-center gap-3 rounded-xl p-2 text-left transition hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                >
                  {exercise.imageUrl ? (
                    <Image
                      src={exercise.imageUrl}
                      alt=""
                      width={56}
                      height={56}
                      className="h-14 w-14 rounded-lg object-cover transition-transform group-hover/details:scale-105"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-lg bg-orange-50 transition-colors group-hover/details:bg-orange-100" />
                  )}
                  <span>
                    <strong className="block text-neutral-900 transition-colors group-hover/details:text-orange-600">
                      {exercise.name}
                    </strong>
                    <span className="text-sm text-neutral-500">
                      {categoryLabel(exercise.category)}
                    </span>
                  </span>
                  <ChevronRight
                    className="ml-auto h-5 w-5 shrink-0 text-orange-300 transition group-hover/details:translate-x-0.5 group-hover/details:text-orange-500"
                    aria-hidden
                  />
                </button>
              </td>
              {exercise.category === 'cardio' ? (
                <td
                  colSpan={3}
                  className="block border-t border-orange-100 py-3 md:table-cell md:border-0 md:px-3 md:py-0"
                >
                  <div className="grid grid-cols-[1fr_7rem] items-center gap-3 md:flex md:justify-center md:gap-5">
                    <span className="text-sm font-bold text-neutral-700">{labels.duration}</span>
                    <NumberInput
                      label={`${exercise.name} ${labels.duration}`}
                      value={exercise.durationMinutes}
                      min={1}
                      step={1}
                      onChange={(value) => onUpdate(index, { durationMinutes: value })}
                      className="md:w-28"
                    />
                  </div>
                </td>
              ) : (
                <>
                  <td className="grid grid-cols-[1fr_7rem] items-center gap-3 border-t border-orange-100 py-3 md:table-cell md:border-0 md:px-3 md:py-0">
                    <span className="text-sm font-bold text-neutral-700 md:hidden">
                      {labels.sets}
                    </span>
                    <NumberInput
                      label={`${exercise.name} ${labels.sets}`}
                      value={exercise.sets}
                      min={1}
                      step={1}
                      onChange={(value) => onUpdate(index, { sets: value })}
                    />
                  </td>
                  <td className="grid grid-cols-[1fr_7rem] items-center gap-3 border-t border-orange-100 py-3 md:table-cell md:border-0 md:px-3 md:py-0">
                    <span className="text-sm font-bold text-neutral-700 md:hidden">
                      {labels.reps}
                    </span>
                    <NumberInput
                      label={`${exercise.name} ${labels.reps}`}
                      value={exercise.reps}
                      min={1}
                      step={1}
                      onChange={(value) => onUpdate(index, { reps: value })}
                    />
                  </td>
                  <td className="grid grid-cols-[1fr_7rem] items-center gap-3 border-t border-orange-100 py-3 md:table-cell md:border-0 md:px-3 md:py-0">
                    <span className="text-sm font-bold text-neutral-700 md:hidden">
                      {labels.weight}
                    </span>
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
                      className="w-full rounded-lg border border-neutral-200 px-3 py-2 outline-none focus:border-orange-500 md:w-24"
                    />
                  </td>
                </>
              )}
              <td className="block border-t border-orange-100 pt-3 md:table-cell md:border-0 md:px-3 md:pt-0">
                <div className="flex items-center justify-end gap-1 md:justify-start">
                  <span className="mr-auto text-sm font-bold text-neutral-700 md:hidden">
                    {labels.actions}
                  </span>
                  <IconButton
                    icon={<ArrowUp className="h-5 w-5" />}
                    label={labels.up}
                    iconOnly
                    variant="ghost"
                    disabled={index === 0}
                    onClick={() => onMove(index, -1)}
                    className="!rounded-lg !p-2"
                  />
                  <IconButton
                    icon={<ArrowDown className="h-5 w-5" />}
                    label={labels.down}
                    iconOnly
                    variant="ghost"
                    disabled={index === exercises.length - 1}
                    onClick={() => onMove(index, 1)}
                    className="!rounded-lg !p-2"
                  />
                  <IconButton
                    icon={<Trash2 className="h-5 w-5" />}
                    label={labels.remove}
                    iconOnly
                    variant="danger"
                    onClick={() => onRemove(index)}
                    className="!rounded-lg !border-transparent !p-2"
                  />
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
  className = '',
}: {
  label: string;
  value: number | null;
  min: number;
  step: number;
  onChange: (value: number) => void;
  className?: string;
}) {
  return (
    <input
      aria-label={label}
      type="number"
      value={value ?? ''}
      min={min}
      step={step}
      onChange={(event) => onChange(Number(event.target.value))}
      className={`w-full rounded-lg border border-neutral-200 px-3 py-2 outline-none focus:border-orange-500 md:w-20 ${className}`}
    />
  );
}
