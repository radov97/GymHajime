'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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
import { useLocale, useTranslations } from 'next-intl';
import Button from '@/components/Button';
import IconButton from '@/components/IconButton';
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
  const railRef = useRef<HTMLElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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

  const updateScrollControls = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    setCanScrollLeft(rail.scrollLeft > 1);
    setCanScrollRight(rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 1);
  }, []);

  useEffect(() => {
    updateScrollControls();
    window.addEventListener('resize', updateScrollControls);
    return () => window.removeEventListener('resize', updateScrollControls);
  }, [updateScrollControls, workouts]);

  const scrollCards = (direction: -1 | 1) =>
    railRef.current?.scrollBy({ left: direction * 340, behavior: 'smooth' });

  const byDay = new Map(workouts.map((workout) => [workout.dayOfWeek, workout]));

  return (
    <main className="mx-auto max-w-[1500px] px-6 py-8 lg:px-10">
      <header className="mb-6 grid gap-4 sm:flex sm:items-end sm:justify-between sm:gap-8 lg:mb-8">
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
        <div>
          <div className="mb-2 hidden justify-end gap-2 xl:flex">
            <IconButton
              icon={<ChevronLeft className="h-5 w-5" />}
              label={t('previous-days')}
              iconOnly
              variant="outline"
              disabled={!canScrollLeft}
              onClick={() => scrollCards(-1)}
              className="!p-2"
            />
            <IconButton
              icon={<ChevronRight className="h-5 w-5" />}
              label={t('next-days')}
              iconOnly
              variant="outline"
              disabled={!canScrollRight}
              onClick={() => scrollCards(1)}
              className="!p-2"
            />
          </div>
          <section
            ref={railRef}
            onScroll={updateScrollControls}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5 xl:flex xl:snap-x xl:snap-mandatory xl:overflow-x-auto xl:scroll-smooth xl:pb-5 xl:pt-2 xl:[scrollbar-color:var(--color-brand)_transparent] xl:[scrollbar-width:thin]"
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
        </div>
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
      className="group flex w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-orange-200 bg-white shadow-sm transition hover:border-orange-400 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 xl:min-h-80 xl:w-80 xl:shrink-0 xl:snap-start xl:hover:-translate-y-0.5"
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
          {workout.exercises.map((exercise, index) => (
            <li
              key={exercise.exerciseId}
              className={`items-start justify-between gap-3 ${index >= 3 ? 'hidden xl:flex' : 'flex'}`}
            >
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
        {workout.exercises.length > 3 && (
          <span className="mt-4 text-sm font-bold text-orange-600 xl:hidden">
            {t('more-exercises', { count: workout.exercises.length - 3 })}
          </span>
        )}
      </div>
    </article>
  );
}

function RestDayCard({ day, restLabel }: { day: string; restLabel: string }) {
  return (
    <article className="flex min-h-28 w-full flex-col rounded-2xl border border-dashed border-orange-200 bg-white/45 p-5 sm:min-h-52 xl:min-h-80 xl:w-80 xl:shrink-0 xl:snap-start">
      <span className="text-xs font-black uppercase tracking-[0.18em] text-neutral-500">{day}</span>
      <div className="flex flex-1 items-center justify-center gap-3 text-center sm:flex-col sm:gap-0">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-100 text-orange-500 sm:mb-4 sm:h-14 sm:w-14">
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
