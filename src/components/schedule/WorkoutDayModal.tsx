import { useEffect, useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Clock3, Dumbbell, ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import ModalPopup from '@/components/ModalPopup';
import IconButton from '@/components/IconButton';
import { formatCategory } from '@/lib/exercises';
import type { Workout, WorkoutExercise } from '@/types/workouts';

export interface WorkoutDayModalProps {
  workout: Workout | null;
  day: string;
  onClose: () => void;
}

/** Read-only, scrollable presentation of one configured day's complete exercise prescription. */
export default function WorkoutDayModal({ workout, day, onClose }: WorkoutDayModalProps) {
  const t = useTranslations('schedule');
  const exerciseT = useTranslations('exercises');
  const [selectedExercise, setSelectedExercise] = useState<WorkoutExercise | null>(null);

  useEffect(() => setSelectedExercise(null), [workout?.id]);

  const close = () => {
    setSelectedExercise(null);
    onClose();
  };

  return (
    <ModalPopup
      isOpen={Boolean(workout)}
      size="wide"
      title={selectedExercise?.name || workout?.name || t('unnamed-workout')}
      subtitle={
        selectedExercise
          ? formatCategory(selectedExercise.category)
          : workout
            ? `${day} · ${t('exercise-count', { count: workout.exercises.length })}`
            : undefined
      }
      onClose={close}
      closeLabel={t('close-details')}
      closeOnBackdropClick
    >
      {workout && selectedExercise ? (
        <ExerciseStage
          exercise={selectedExercise}
          previousLabel={exerciseT('previous-image')}
          nextLabel={exerciseT('next-image')}
          backLabel={t('back-to-workout')}
          onBack={() => setSelectedExercise(null)}
        />
      ) : workout ? (
        <ol className="max-h-[65vh] space-y-3 overflow-y-auto pr-2 [scrollbar-color:var(--color-brand)_transparent] [scrollbar-width:thin]">
          {workout.exercises.map((exercise, index) => {
            const image = exercise.details?.images[0]?.url ?? exercise.imageUrl;
            return (
              <li key={exercise.exerciseId}>
                <button
                  type="button"
                  onClick={() => setSelectedExercise(exercise)}
                  className="group grid w-full cursor-pointer grid-cols-[2rem_4rem_minmax(0,1fr)_1.25rem] items-center gap-3 rounded-2xl border border-orange-100 bg-white p-3 text-left shadow-sm transition hover:border-orange-300 hover:bg-orange-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 sm:grid-cols-[2.5rem_5rem_minmax(0,1fr)_auto_1.25rem] sm:gap-4 sm:p-4"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-sm font-black text-orange-700">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {image ? (
                    <Image
                      src={image}
                      alt=""
                      width={80}
                      height={80}
                      className="h-16 w-16 rounded-xl object-cover sm:h-20 sm:w-20"
                    />
                  ) : (
                    <span className="flex h-16 w-16 items-center justify-center rounded-xl bg-orange-50 text-orange-300 sm:h-20 sm:w-20">
                      <ImageIcon className="h-7 w-7" aria-hidden />
                    </span>
                  )}
                  <span className="min-w-0">
                    <strong className="block truncate text-lg text-neutral-900 transition-colors group-hover:text-orange-600">
                      {exercise.name}
                    </strong>
                    <span className="mt-1 block text-sm font-semibold text-neutral-500">
                      {formatCategory(exercise.category)}
                    </span>
                  </span>
                  <span className="col-start-3 flex flex-col items-start gap-2 sm:col-auto sm:min-w-32 sm:items-end">
                    {exercise.category === 'cardio' ? (
                      <Prescription icon={<Clock3 className="h-4 w-4" />}>
                        {t('minutes', { count: exercise.durationMinutes ?? 0 })}
                      </Prescription>
                    ) : (
                      <>
                        <Prescription icon={<Dumbbell className="h-4 w-4" />}>
                          {t('sets-reps', { sets: exercise.sets ?? 0, reps: exercise.reps ?? 0 })}
                        </Prescription>
                        {exercise.weight !== null && (
                          <span className="text-xs font-bold text-neutral-500">
                            {t('weight-kilograms', { weight: exercise.weight })}
                          </span>
                        )}
                      </>
                    )}
                  </span>
                  <ChevronRight
                    className="col-start-4 row-start-1 h-5 w-5 text-orange-300 transition group-hover:translate-x-0.5 group-hover:text-orange-500 sm:col-auto sm:row-auto"
                    aria-hidden
                  />
                </button>
              </li>
            );
          })}
        </ol>
      ) : null}
    </ModalPopup>
  );
}

function ExerciseStage({
  exercise,
  previousLabel,
  nextLabel,
  backLabel,
  onBack,
}: {
  exercise: WorkoutExercise;
  previousLabel: string;
  nextLabel: string;
  backLabel: string;
  onBack: () => void;
}) {
  const t = useTranslations('schedule');
  const [imageIndex, setImageIndex] = useState(0);
  const images = exercise.details?.images.length
    ? exercise.details.images
    : exercise.imageUrl
      ? [{ image_path: exercise.imageUrl, sort_order: 0, url: exercise.imageUrl }]
      : [];

  useEffect(() => setImageIndex(0), [exercise.exerciseId]);
  useEffect(() => {
    if (images.length <= 1) return;
    const interval = window.setInterval(
      () => setImageIndex((current) => (current + 1) % images.length),
      2000
    );
    return () => window.clearInterval(interval);
  }, [images.length]);

  const changeImage = (step: number) =>
    setImageIndex((current) => (current + step + images.length) % images.length);
  const image = images[imageIndex];

  return (
    <div>
      <IconButton
        icon={<ArrowLeft className="h-4 w-4" />}
        label={backLabel}
        variant="ghost"
        onClick={onBack}
        className="mb-5 !w-auto !p-0 hover:!bg-transparent"
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(16rem,0.65fr)]">
        <div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-orange-100 bg-white">
            {image ? (
              <Image
                key={image.image_path}
                src={image.url}
                alt={`${exercise.name} ${imageIndex + 1}`}
                fill
                sizes="640px"
                className="exercise-carousel-image object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-orange-300">
                <ImageIcon className="h-12 w-12" aria-hidden />
              </div>
            )}
            {images.length > 1 && (
              <>
                <IconButton
                  icon={<ChevronLeft className="h-6 w-6" />}
                  label={previousLabel}
                  iconOnly
                  variant="ghost"
                  onClick={() => changeImage(-1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 !rounded-full !bg-white/90 !p-2 shadow"
                />
                <IconButton
                  icon={<ChevronRight className="h-6 w-6" />}
                  label={nextLabel}
                  iconOnly
                  variant="ghost"
                  onClick={() => changeImage(1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 !rounded-full !bg-white/90 !p-2 shadow"
                />
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex justify-center gap-2">
              {images.map((item, index) => (
                <button
                  key={item.image_path}
                  type="button"
                  aria-label={`${nextLabel} ${index + 1}`}
                  onClick={() => setImageIndex(index)}
                  className={`h-2.5 w-2.5 cursor-pointer rounded-full ${index === imageIndex ? 'bg-orange-500' : 'bg-orange-200'}`}
                />
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <div className="rounded-2xl border border-orange-100 bg-white p-5">
            <span className="text-xs font-black uppercase tracking-widest text-neutral-500">
              {t('prescription')}
            </span>
            <div className="mt-3">
              {exercise.category === 'cardio' ? (
                <Prescription icon={<Clock3 className="h-4 w-4" />}>
                  {t('minutes', { count: exercise.durationMinutes ?? 0 })}
                </Prescription>
              ) : (
                <div className="flex items-center gap-3">
                  <Prescription icon={<Dumbbell className="h-4 w-4" />}>
                    {t('sets-reps', { sets: exercise.sets ?? 0, reps: exercise.reps ?? 0 })}
                  </Prescription>
                  {exercise.weight !== null && (
                    <strong className="text-sm text-neutral-600">
                      {t('weight-kilograms', { weight: exercise.weight })}
                    </strong>
                  )}
                </div>
              )}
            </div>
          </div>
          <p className="mt-5 whitespace-pre-line leading-7 text-neutral-700">
            {exercise.details?.description || '—'}
          </p>
        </div>
      </div>
    </div>
  );
}

function Prescription({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1.5 text-sm font-bold text-orange-700">
      <span aria-hidden>{icon}</span>
      {children}
    </span>
  );
}
