import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import type { ReactNode } from 'react';
import type { WorkoutExercise } from '@/types/workouts';

export interface WorkoutExerciseIdentityProps {
  exercise: WorkoutExercise;
  categoryLabel: string;
  onClick: () => void;
  trailing?: ReactNode;
  className?: string;
}

/** Shared interactive identity for opening a workout exercise's read-only details. */
export default function WorkoutExerciseIdentity({
  exercise,
  categoryLabel,
  onClick,
  trailing,
  className = '',
}: WorkoutExerciseIdentityProps) {
  const imageUrl = exercise.details?.images[0]?.url ?? exercise.imageUrl;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group/details flex w-full min-w-0 cursor-pointer items-center gap-3 rounded-xl text-left transition hover:border-orange-300 hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ${className}`}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt=""
          width={56}
          height={56}
          className="h-14 w-14 shrink-0 rounded-lg object-cover transition-transform group-hover/details:scale-105"
        />
      ) : (
        <span className="h-14 w-14 shrink-0 rounded-lg bg-orange-50 transition-colors group-hover/details:bg-orange-100" />
      )}
      <span className="min-w-0 flex-1">
        <strong className="block truncate text-neutral-900 transition-colors group-hover/details:text-orange-600">
          {exercise.name}
        </strong>
        <span className="block truncate text-sm text-neutral-500">{categoryLabel}</span>
      </span>
      {trailing && <span className="shrink-0">{trailing}</span>}
      <ChevronRight
        className="h-5 w-5 shrink-0 text-orange-300 transition group-hover/details:translate-x-0.5 group-hover/details:text-orange-500"
        aria-hidden
      />
    </button>
  );
}
