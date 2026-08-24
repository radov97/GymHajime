'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Loader,
  MoonStar,
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Button from '@/components/Button';
import IconButton from '@/components/IconButton';
import ModalPopup from '@/components/ModalPopup';
import WorkoutExerciseIdentity from '@/components/exercises/WorkoutExerciseIdentity';
import { WorkoutExerciseDetails } from '@/components/schedule/WorkoutDayModal';
import { getWeeklySchedule } from '@/api/workouts';
import { ButtonRank } from '@/lib/enums';
import { formatCategory } from '@/lib/exercises';
import type { Workout, WorkoutExercise } from '@/types/workouts';

export interface DailyWorkoutProps {
  loadSchedule?: typeof getWeeklySchedule;
  /** Injectable clock used by stories and deterministic tests. */
  today?: Date;
}

const relativeKeys = ['yesterday', 'today', 'tomorrow'] as const;

/** Shows yesterday, today, or tomorrow without exposing the complete weekly schedule. */
export default function DailyWorkout({
  loadSchedule = getWeeklySchedule,
  today = new Date(),
}: DailyWorkoutProps) {
  const locale = useLocale();
  const t = useTranslations('daily-training');
  const schedule = useTranslations('schedule');
  const exerciseT = useTranslations('exercises');
  const [offset, setOffset] = useState(0);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState<WorkoutExercise | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const result = await loadSchedule(locale);
      setWorkouts(result.workouts);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [loadSchedule, locale]);

  useEffect(() => {
    void load();
  }, [load, retry]);

  const selectedDate = useMemo(() => {
    const date = new Date(today);
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + offset);
    return date;
  }, [offset, today]);
  const dayOfWeek = selectedDate.getDay() || 7;
  const workout = workouts.find((item) => item.dayOfWeek === dayOfWeek);
  const relativeLabel = t(relativeKeys[offset + 1]);
  const formattedDate = new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(selectedDate);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-6 sm:pt-8 lg:px-10 lg:py-10">
      <header className="mb-6 lg:mb-8">
        <h1 className="sr-only">{t('title')}</h1>
        <div className="mb-2 flex items-center gap-2.5 text-orange-600 sm:mb-3 sm:gap-3">
          <CalendarDays className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />
          <span className="text-xs font-black uppercase tracking-[0.16em] sm:text-sm sm:tracking-[0.18em]">
            {t('eyebrow')}
          </span>
        </div>
        <p className="max-w-2xl text-base font-semibold text-[var(--color-brand-ink)] sm:text-lg">
          {t('description')}
        </p>
      </header>

      {loading ? (
        <PageState>
          <Loader className="h-9 w-9 animate-spin text-orange-500" aria-hidden />
          {t('loading')}
        </PageState>
      ) : error ? (
        <PageState>
          <AlertCircle className="h-9 w-9 text-red-500" aria-hidden />
          <strong>{t('error')}</strong>
          <Button
            text={t('retry')}
            rank={ButtonRank.Secondary}
            className="!w-auto"
            onClick={() => setRetry((value) => value + 1)}
          />
        </PageState>
      ) : (
        <section className="lg:grid lg:grid-cols-[3.5rem_minmax(0,1fr)_3.5rem] lg:items-center lg:gap-5">
          <IconButton
            icon={<ChevronLeft className="h-6 w-6" />}
            label={t('previous')}
            iconOnly
            variant="outline"
            disabled={offset === -1}
            onClick={() => setOffset((value) => Math.max(-1, value - 1))}
            className="hidden h-14 w-14 !p-0 lg:flex"
          />

          <article className="min-w-0 overflow-hidden rounded-2xl border border-orange-200 bg-white shadow-sm sm:rounded-3xl">
            <header className="flex flex-col items-start gap-4 bg-[var(--color-brand-soft)] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-6">
              <div>
                <span className="text-xs font-black uppercase tracking-[0.18em] text-orange-600 sm:text-sm">
                  {relativeLabel}
                </span>
                <p className="mt-1 text-xl font-black capitalize text-[var(--color-brand-ink)] sm:text-2xl">
                  {formattedDate}
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 shadow-sm sm:block sm:rounded-2xl sm:px-4 sm:py-3 sm:text-right">
                <strong className="block text-xl text-orange-600 sm:text-2xl">
                  {workout?.exercises.length ?? 0}
                </strong>
                <span className="text-sm font-semibold text-neutral-500">
                  {schedule('exercise-count', { count: workout?.exercises.length ?? 0 })}
                </span>
              </div>
            </header>

            {workout ? (
              <div className="px-4 py-5 sm:px-8 sm:py-7">
                <h2 className="text-2xl font-black text-[var(--color-brand-ink)] sm:text-3xl">
                  {workout.name || schedule('unnamed-workout')}
                </h2>
                <ul className="mt-4 space-y-3 sm:mt-6 xl:max-h-[25rem] xl:overflow-y-auto xl:pr-2">
                  {workout.exercises.map((exercise) => (
                    <li key={exercise.exerciseId}>
                      <WorkoutExerciseIdentity
                        exercise={exercise}
                        categoryLabel={formatCategory(exercise.category)}
                        onClick={() => setSelectedExercise(exercise)}
                        className="border border-orange-100 bg-orange-50/40 p-3 sm:rounded-2xl sm:p-4"
                        trailing={
                          <span className="block rounded-full bg-white px-3 py-2 text-xs font-black text-orange-700 shadow-sm sm:px-4 sm:text-sm">
                            {exercise.category === 'cardio' ? (
                              <span className="flex items-center gap-1.5">
                                <Clock3 className="h-4 w-4" aria-hidden />
                                {schedule('minutes', { count: exercise.durationMinutes ?? 0 })}
                              </span>
                            ) : (
                              schedule('sets-reps', {
                                sets: exercise.sets ?? 0,
                                reps: exercise.reps ?? 0,
                              })
                            )}
                          </span>
                        }
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="flex min-h-64 flex-col items-center justify-center gap-4 px-5 py-10 text-center sm:min-h-80 sm:px-8 sm:py-12">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-orange-500 sm:h-16 sm:w-16">
                  <MoonStar className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden />
                </span>
                <h2 className="text-2xl font-black text-[var(--color-brand-ink)]">
                  {schedule('rest-day')}
                </h2>
                <p className="font-semibold text-neutral-500">{t('rest-message')}</p>
              </div>
            )}
          </article>

          <IconButton
            icon={<ChevronRight className="h-6 w-6" />}
            label={t('next')}
            iconOnly
            variant="outline"
            disabled={offset === 1}
            onClick={() => setOffset((value) => Math.min(1, value + 1))}
            className="hidden h-14 w-14 !p-0 lg:flex"
          />
        </section>
      )}

      {!loading && !error && (
        <div className="fixed bottom-0 left-20 right-0 z-30 grid grid-cols-2 gap-3 border-t border-orange-200 bg-[var(--color-brand-soft)]/95 p-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] backdrop-blur min-[769px]:left-64 lg:hidden">
          <IconButton
            icon={<ChevronLeft className="h-6 w-6" />}
            label={t('previous')}
            iconOnly
            variant="outline"
            disabled={offset === -1}
            onClick={() => setOffset((value) => Math.max(-1, value - 1))}
            className="h-12 w-full justify-center !p-0 sm:h-14"
          />
          <IconButton
            icon={<ChevronRight className="h-6 w-6" />}
            label={t('next')}
            iconOnly
            variant="outline"
            disabled={offset === 1}
            onClick={() => setOffset((value) => Math.min(1, value + 1))}
            className="h-12 w-full justify-center !p-0 sm:h-14"
          />
        </div>
      )}

      <ModalPopup
        isOpen={Boolean(selectedExercise)}
        size="wide"
        title={selectedExercise?.name}
        subtitle={selectedExercise ? formatCategory(selectedExercise.category) : undefined}
        onClose={() => setSelectedExercise(null)}
        closeLabel={schedule('close-details')}
        closeOnBackdropClick
      >
        {selectedExercise && (
          <WorkoutExerciseDetails
            exercise={selectedExercise}
            previousLabel={exerciseT('previous-image')}
            nextLabel={exerciseT('next-image')}
          />
        )}
      </ModalPopup>
    </main>
  );
}

function PageState({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="status"
      className="flex min-h-72 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-orange-200 bg-white/60 p-6 text-center text-neutral-600 sm:min-h-96 sm:rounded-3xl sm:p-8"
    >
      {children}
    </div>
  );
}
