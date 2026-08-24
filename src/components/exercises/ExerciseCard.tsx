import { Bookmark, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { formatCategory, type Exercise } from '@/lib/exercises';
import IconButton from '@/components/IconButton';

interface Props {
  exercise: Exercise;
  categoryLabel?: string;
  saved: boolean;
  saving: boolean;
  onOpen: () => void;
  onToggleSave: () => void;
  saveLabel: string;
  removeLabel: string;
}

export default function ExerciseCard({
  exercise,
  categoryLabel,
  saved,
  saving,
  onOpen,
  onToggleSave,
  saveLabel,
  removeLabel,
}: Props) {
  const primaryImage = exercise.images[0];
  return (
    <article className="group overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <button type="button" onClick={onOpen} className="block w-full cursor-pointer text-left">
        <div className="relative aspect-[4/3] overflow-hidden bg-orange-50">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt=""
              fill
              sizes="(min-width: 1536px) 25vw, (min-width: 1280px) 33vw, 50vw"
              className="object-cover transition duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-orange-300">
              <ImageIcon className="h-10 w-10" />
            </div>
          )}
        </div>
      </button>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={onOpen}
            className="min-w-0 flex-1 cursor-pointer text-left"
          >
            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-orange-600">
              {categoryLabel ?? formatCategory(exercise.category)}
            </p>
            <h2 className="truncate text-lg font-bold text-neutral-900">{exercise.name}</h2>
          </button>
          <IconButton
            icon={<Bookmark className="h-5 w-5" fill={saved ? 'currentColor' : 'none'} />}
            label={saved ? removeLabel : saveLabel}
            iconOnly
            variant={saved ? 'primary' : 'ghost'}
            disabled={saving}
            onClick={onToggleSave}
            aria-pressed={saved}
            className={`!rounded-full !p-2 disabled:cursor-wait ${saved ? '' : '!bg-orange-50 !text-orange-600 hover:!bg-orange-100'}`}
          />
        </div>
        <button
          type="button"
          onClick={onOpen}
          className="mt-3 block w-full cursor-pointer text-left"
        >
          <p className="line-clamp-2 min-h-10 text-sm leading-5 text-neutral-600">
            {exercise.description || '—'}
          </p>
        </button>
      </div>
    </article>
  );
}
