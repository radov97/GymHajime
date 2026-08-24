'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Dumbbell,
  Loader,
  MoonStar,
} from 'lucide-react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import Button from '@/components/Button';
import IconButton from '@/components/IconButton';
import { getWeeklySchedule } from '@/api/workouts';
import { ButtonRank } from '@/lib/enums';
import type { Workout } from '@/types/workouts';

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
  const [offset, setOffset] = useState(0);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);

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
    <main className="mx-auto max-w-6xl px-10 py-10">
      <header className="mb-8">
        <h1 className="sr-only">{t('title')}</h1>
        <div className="mb-3 flex items-center gap-3 text-orange-600">
          <CalendarDays className="h-6 w-6" aria-hidden />
          <span className="text-sm font-black uppercase tracking-[0.18em]">{t('eyebrow')}</span>
        </div>
        <p className="max-w-2xl text-lg font-semibold text-[var(--color-brand-ink)]">
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
        <section className="grid grid-cols-[3.5rem_minmax(0,1fr)_3.5rem] items-center gap-5">
          <IconButton
            icon={<ChevronLeft className="h-6 w-6" />}
            label={t('previous')}
            iconOnly
            variant="outline"
            disabled={offset === -1}
            onClick={() => setOffset((value) => Math.max(-1, value - 1))}
            className="h-14 w-14 !p-0"
          />

          <article className="overflow-hidden rounded-3xl border border-orange-200 bg-white shadow-sm">
            <header className="flex items-center justify-between bg-[var(--color-brand-soft)] px-8 py-6">
              <div>
                <span className="text-sm font-black uppercase tracking-[0.18em] text-orange-600">
                  {relativeLabel}
                </span>
                <p className="mt-1 text-2xl font-black capitalize text-[var(--color-brand-ink)]">
                  {formattedDate}
                </p>
              </div>
              <div className="rounded-2xl bg-white px-4 py-3 text-right shadow-sm">
                <strong className="block text-2xl text-orange-600">
                  {workout?.exercises.length ?? 0}
                </strong>
                <span className="text-sm font-semibold text-neutral-500">
                  {schedule('exercise-count', { count: workout?.exercises.length ?? 0 })}
                </span>
              </div>
            </header>

            {workout ? (
              <div className="px-8 py-7">
                <h2 className="text-3xl font-black text-[var(--color-brand-ink)]">
                  {workout.name || schedule('unnamed-workout')}
                </h2>
                <ul className="mt-6 max-h-[25rem] space-y-3 overflow-y-auto pr-2">
                  {workout.exercises.map((exercise) => (
                    <li
                      key={exercise.exerciseId}
                      className="flex items-center gap-4 rounded-2xl border border-orange-100 bg-orange-50/40 p-4"
                    >
                      <div className="relative flex h-16 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-orange-100 text-orange-500">
                        {exercise.imageUrl ? (
                          <Image
                            src={exercise.imageUrl}
                            alt=""
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        ) : (
                          <Dumbbell className="h-6 w-6" aria-hidden />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <strong className="block truncate text-lg text-neutral-900">
                          {exercise.name}
                        </strong>
                        <span className="text-sm font-semibold capitalize text-neutral-500">
                          {exercise.category}
                        </span>
                      </div>
                      <span className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-black text-orange-700 shadow-sm">
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
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="flex min-h-80 flex-col items-center justify-center gap-4 px-8 py-12 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                  <MoonStar className="h-8 w-8" aria-hidden />
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
            className="h-14 w-14 !p-0"
          />
        </section>
      )}
    </main>
  );
}

function PageState({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="status"
      className="flex min-h-96 flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-orange-200 bg-white/60 p-8 text-neutral-600"
    >
      {children}
    </div>
  );
}
