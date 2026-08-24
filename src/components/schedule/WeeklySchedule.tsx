'use client';

import { useCallback, useEffect, useState } from 'react';
import { AlertCircle, CalendarDays, Clock3, Dumbbell, Loader, MoonStar } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Button from '@/components/Button';
import { ButtonRank } from '@/lib/enums';
import { getWeeklySchedule } from '@/api/workouts';
import type { Workout } from '@/types/workouts';
import WorkoutDayModal from './WorkoutDayModal';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export interface WeeklyScheduleProps {
  loadSchedule?: typeof getWeeklySchedule;
}

/** Read-only overview of the user's configured training week and rest days. */
export default function WeeklySchedule({ loadSchedule = getWeeklySchedule }: WeeklyScheduleProps) {
  const locale = useLocale();
  const t = useTranslations('schedule');
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [selected, setSelected] = useState<{ workout: Workout; day: string } | null>(null);

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

  const byDay = new Map(workouts.map((workout) => [workout.dayOfWeek, workout]));

  return (
    <main className="mx-auto max-w-[1500px] px-6 py-8 lg:px-10">
      <header className="mb-8 flex items-end justify-between gap-8">
        <div>
          <h1 className="sr-only">{t('title')}</h1>
          <div className="mb-2 flex items-center gap-3 text-orange-600">
            <CalendarDays className="h-6 w-6" aria-hidden />
            <span className="text-sm font-black uppercase tracking-[0.18em]">{t('eyebrow')}</span>
          </div>
          <p className="max-w-2xl text-lg font-semibold text-[var(--color-brand-ink)]">
            {t('description')}
          </p>
        </div>
        {!loading && !error && (
          <div className="rounded-2xl border border-orange-100 bg-white px-5 py-3 text-right shadow-sm">
            <strong className="block text-2xl text-orange-600">{workouts.length}</strong>
            <span className="text-sm font-semibold text-neutral-500">
              {t('training-days', { count: workouts.length })}
            </span>
          </div>
        )}
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
        <section
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-5 [scrollbar-color:var(--color-brand)_transparent] [scrollbar-width:thin]"
          aria-label={t('week')}
        >
          {DAYS.map((day, index) => {
            const workout = byDay.get(index + 1);
            return workout ? (
              <WorkoutDayCard
                key={day}
                day={t(`days.${day}`)}
                workout={workout}
                onOpen={() => setSelected({ workout, day: t(`days.${day}`) })}
              />
            ) : (
              <RestDayCard key={day} day={t(`days.${day}`)} restLabel={t('rest-day')} />
            );
          })}
        </section>
      )}
      <WorkoutDayModal
        workout={selected?.workout ?? null}
        day={selected?.day ?? ''}
        onClose={() => setSelected(null)}
      />
    </main>
  );
}

function WorkoutDayCard({
  day,
  workout,
  onOpen,
}: {
  day: string;
  workout: Workout;
  onOpen: () => void;
}) {
  const t = useTranslations('schedule');
  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={t('open-workout', { day })}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onOpen();
        }
      }}
      className="group flex min-h-80 w-80 shrink-0 cursor-pointer snap-start flex-col overflow-hidden rounded-2xl border border-orange-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-orange-400 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
    >
      <header className="bg-[var(--color-brand)] px-5 py-4 text-white">
        <span className="text-xs font-black uppercase tracking-[0.18em] text-orange-100">
          {day}
        </span>
        <h2 className="mt-1 truncate text-xl font-bold group-hover:underline">
          {workout.name || t('unnamed-workout')}
        </h2>
      </header>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-neutral-500">
          <Dumbbell className="h-4 w-4 text-orange-500" aria-hidden />
          {t('exercise-count', { count: workout.exercises.length })}
        </div>
        <ul className="space-y-3">
          {workout.exercises.map((exercise) => (
            <li key={exercise.exerciseId} className="flex items-start justify-between gap-3">
              <span className="min-w-0 truncate font-semibold text-neutral-800">
                {exercise.name}
              </span>
              <span className="shrink-0 rounded-full bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-700">
                {exercise.category === 'cardio' ? (
                  <span className="flex items-center gap-1">
                    <Clock3 className="h-3.5 w-3.5" aria-hidden />
                    {t('minutes', { count: exercise.durationMinutes ?? 0 })}
                  </span>
                ) : (
                  t('sets-reps', { sets: exercise.sets ?? 0, reps: exercise.reps ?? 0 })
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

function RestDayCard({ day, restLabel }: { day: string; restLabel: string }) {
  return (
    <article className="flex min-h-80 w-80 shrink-0 snap-start flex-col rounded-2xl border border-dashed border-orange-200 bg-white/45 p-5">
      <span className="text-xs font-black uppercase tracking-[0.18em] text-neutral-500">{day}</span>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-orange-500">
          <MoonStar className="h-7 w-7" aria-hidden />
        </span>
        <h2 className="text-lg font-bold text-[var(--color-brand-ink)]">{restLabel}</h2>
      </div>
    </article>
  );
}

function PageState({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="status"
      className="flex min-h-80 flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-orange-200 bg-white/60 p-8 text-neutral-600"
    >
      {children}
    </div>
  );
}
