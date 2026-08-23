'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertCircle, Dumbbell, Loader } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { getExercises } from '@/api/exercises';
import { deleteSavedExercise, getSavedExercises, saveExercise } from '@/api/savedExercises';
import { isLocale } from '@/i18n/i18n';
import { EXERCISES_PAGE_SIZE, formatCategory, type Exercise } from '@/lib/exercises';
import ExerciseCard from './ExerciseCard';
import ExerciseDetailsDrawer from './ExerciseDetailsDrawer';
import ExerciseFilters from './ExerciseFilters';
import WorkoutBuilder from './WorkoutBuilder';

type Tab = 'explore' | 'mine' | 'builder';

const CATEGORY_TRANSLATION_KEYS = {
  arms: 'categories.arms',
  back: 'categories.back',
  cardio: 'categories.cardio',
  chest: 'categories.chest',
  core: 'categories.core',
  legs: 'categories.legs',
  shoulders: 'categories.shoulders',
} as const;

/**
 * Coordinates the Exercises screen.
 *
 * This component owns presentation state and calls the frontend HTTP API helpers. It deliberately
 * does not know anything about Supabase tables: requests travel through `src/api`, Next.js route
 * handlers, and the service layer before reaching the database.
 */
export default function ExercisesPage() {
  // next-intl supplies translated UI labels and the locale used for exercise translations.
  const t = useTranslations('exercises');
  const rawLocale = useLocale();
  const locale = isLocale(rawLocale) ? rawLocale : 'en';

  /** Translates known enum values and safely formats any category introduced in the future. */
  const getCategoryLabel = (category: string) => {
    const key = CATEGORY_TRANSLATION_KEYS[category as keyof typeof CATEGORY_TRANSLATION_KEYS];
    return key ? t(key) : formatCategory(category);
  };

  // Filter and navigation state represents choices made directly by the user.
  const [tab, setTab] = useState<Tab>('explore');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('');

  // API data is split between the public catalogue and the authenticated user's library.
  const [categories, setCategories] = useState<string[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [mineExercises, setMineExercises] = useState<Exercise[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  // Interaction state drives per-card saving feedback and the exercise details drawer.
  const [savingId, setSavingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Exercise | null>(null);

  // Pagination and request state control loading, retry, result count, and error UI.
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  /**
   * Debounces the raw search input by 350 ms.
   *
   * React reruns this effect whenever `search` changes. Its cleanup cancels the previous timer, so
   * rapid keystrokes produce one API request after the user pauses instead of one per keypress.
   */
  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => window.clearTimeout(timer);
  }, [search]);

  /**
   * Starts pagination over whenever a query-defining value changes.
   * Existing cards are cleared because page zero for the new search/filter is unrelated to the
   * pages accumulated for the previous query.
   */
  useEffect(() => {
    setPage(0);
    setExercises([]);
  }, [debouncedSearch, category, locale]);

  /**
   * Loads the authenticated user's saved library on first render and after a locale change.
   *
   * `mineExercises` supplies the My Exercises tab, while the Set gives constant-time bookmark
   * checks for catalogue cards. The `current` flag prevents an older async response from changing
   * state after this effect has been cleaned up.
   */
  useEffect(() => {
    let current = true;
    void getSavedExercises(locale)
      .then(({ exercises: saved }) => {
        if (!current) return;
        setMineExercises(saved);
        setSavedIds(new Set(saved.map((exercise) => exercise.id)));
      })
      .catch(() => undefined);
    return () => {
      current = false;
    };
  }, [locale]);

  /**
   * Fetches one catalogue page whenever pagination, filters, locale, or retry state changes.
   *
   * Page zero replaces the grid; later pages append for the Load More behavior. The component uses
   * zero-based pages internally, while the public HTTP API uses conventional one-based pages, so
   * `page + 1` is sent to the API client. Categories and total count arrive in the same response.
   */
  useEffect(() => {
    let current = true;
    const fetchExercises = async () => {
      page === 0 ? setLoading(true) : setLoadingMore(true);
      setError(null);
      try {
        const result = await getExercises({
          page: page + 1,
          limit: EXERCISES_PAGE_SIZE,
          search: debouncedSearch,
          category,
          locale,
        });
        if (!current) return;
        setExercises((existing) =>
          page === 0 ? result.exercises : [...existing, ...result.exercises]
        );
        setCategories(result.categories);
        setTotal(result.total);
      } catch (queryError) {
        if (current)
          setError(queryError instanceof Error ? queryError.message : 'Unable to load exercises');
      }
      setLoading(false);
      setLoadingMore(false);
    };
    void fetchExercises();
    return () => {
      current = false;
    };
  }, [category, debouncedSearch, locale, page, retryKey]);

  /**
   * Saves or removes an exercise according to its current bookmark state.
   *
   * The backend mutation runs first. After it succeeds, both the saved-ID Set and My Exercises list
   * are updated locally so the two tabs stay synchronized without another network request.
   * `useCallback` retains the function between renders until its catalogue or saved-ID inputs change.
   */
  const toggleSave = useCallback(
    async (exerciseId: string) => {
      setSavingId(exerciseId);
      const isSaved = savedIds.has(exerciseId);
      try {
        await (isSaved ? deleteSavedExercise(exerciseId) : saveExercise(exerciseId));
        setSavedIds((existing) => {
          const next = new Set(existing);
          isSaved ? next.delete(exerciseId) : next.add(exerciseId);
          return next;
        });
        setMineExercises((existing) => {
          if (isSaved) return existing.filter((exercise) => exercise.id !== exerciseId);
          const exercise = exercises.find((item) => item.id === exerciseId);
          return exercise ? [...existing, exercise] : existing;
        });
      } catch (mutationError) {
        setError(
          mutationError instanceof Error ? mutationError.message : 'Unable to save exercise'
        );
      }
      setSavingId(null);
    },
    [exercises, savedIds]
  );

  // Only recompute the active tab's data when one of its source arrays or the tab changes.
  const visible = useMemo(
    () => (tab === 'explore' ? exercises : mineExercises),
    [exercises, mineExercises, tab]
  );

  /** Creates a consistently configured card while keeping the grid markup concise. */
  const card = (exercise: Exercise) => (
    <ExerciseCard
      key={exercise.id}
      exercise={exercise}
      categoryLabel={getCategoryLabel(exercise.category)}
      saved={savedIds.has(exercise.id)}
      saving={savingId === exercise.id}
      onOpen={() => setSelected(exercise)}
      onToggleSave={() => void toggleSave(exercise.id)}
      saveLabel={t('save')}
      removeLabel={t('remove')}
    />
  );

  return (
    <main className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-10">
      <h1 className="text-3xl font-bold text-[var(--color-brand-ink)]">{t('title')}</h1>
      {/* Keep tabs and catalogue controls reachable while users browse a long list. */}
      <div
        className="sticky top-0 z-20 -mx-4 mt-3 border-b border-orange-100 bg-[var(--color-brand-soft)]/95 px-4 py-2 shadow-sm backdrop-blur-sm sm:-mx-6 sm:px-6 md:py-4 lg:-mx-10 lg:px-10"
        data-testid="sticky-exercise-filters"
      >
        <div className="flex gap-4 border-b border-orange-100 sm:gap-8" role="tablist">
          {(['explore', 'mine', 'builder'] as const).map((value) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={tab === value}
              onClick={() => setTab(value)}
              className={`cursor-pointer border-b-2 px-1 pb-3 text-sm font-bold transition ${tab === value ? 'border-orange-500 text-orange-600' : 'border-transparent text-neutral-500 hover:text-neutral-900'}`}
            >
              {t(value)}
            </button>
          ))}
        </div>
        {tab === 'explore' && (
          <div className="mt-3 md:mt-5">
            <ExerciseFilters
              search={search}
              onSearchChange={setSearch}
              categories={categories}
              category={category}
              onCategoryChange={setCategory}
              getCategoryLabel={getCategoryLabel}
              labels={{
                search: t('search'),
                clear: t('clear-search'),
                all: t('all'),
                category: t('category-filter'),
              }}
            />
          </div>
        )}
      </div>

      {tab === 'explore' ? (
        <section className="mt-7 space-y-7">
          {!loading && !error && (
            <p className="text-sm font-semibold text-neutral-600" aria-live="polite">
              {t('result-count', { count: total })}
            </p>
          )}
          {loading ? (
            <Status>
              <Loader className="h-8 w-8 animate-spin text-orange-500" />
              <span>{t('loading')}</span>
            </Status>
          ) : error ? (
            <Status>
              <AlertCircle className="h-8 w-8 text-red-500" />
              <span>{t('error')}</span>
              <button
                type="button"
                onClick={() => setRetryKey((value) => value + 1)}
                className="cursor-pointer font-bold text-orange-600"
              >
                {t('retry')}
              </button>
            </Status>
          ) : exercises.length === 0 ? (
            <Status>
              <Dumbbell className="h-9 w-9 text-orange-400" />
              <strong>{search ? t('no-results-search', { search }) : t('no-results')}</strong>
              <span>{t('no-results-help')}</span>
              {(search || category) && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setCategory('');
                  }}
                  className="cursor-pointer font-bold text-orange-600"
                >
                  {t('clear-filters')}
                </button>
              )}
            </Status>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {exercises.map(card)}
              </div>
              {exercises.length < total && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    disabled={loadingMore}
                    onClick={() => setPage((value) => value + 1)}
                    className="cursor-pointer rounded-xl border border-orange-500 bg-white px-7 py-3 font-bold text-orange-600 hover:bg-orange-50 disabled:opacity-60"
                  >
                    {loadingMore ? t('loading') : t('load-more')}
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      ) : tab === 'mine' ? (
        <section className="mt-8">
          {visible.length ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {visible.map(card)}
            </div>
          ) : (
            <Status>
              <BookmarkIcon />
              <strong>{t('empty-title')}</strong>
              <span>{t('empty-description')}</span>
              <button
                type="button"
                onClick={() => setTab('explore')}
                className="cursor-pointer rounded-xl bg-orange-500 px-5 py-2.5 font-bold text-white"
              >
                {t('explore-action')}
              </button>
            </Status>
          )}
        </section>
      ) : (
        <WorkoutBuilder
          locale={locale}
          savedExercises={mineExercises}
          categoryLabel={getCategoryLabel}
          labels={{
            builder: t('builder'),
            day: t('builder-day'),
            workoutName: t('builder-name'),
            namePlaceholder: t('builder-name-placeholder'),
            add: t('builder-add'),
            loading: t('builder-loading'),
            error: t('builder-error'),
            retry: t('retry'),
            empty: t('builder-empty', { day: '__DAY__' }),
            exercise: t('builder-exercise'),
            sets: t('builder-sets'),
            reps: t('builder-reps'),
            weight: t('builder-weight'),
            actions: t('builder-actions'),
            up: t('builder-up'),
            down: t('builder-down'),
            remove: t('builder-remove'),
            save: t('builder-save'),
            saving: t('builder-saving'),
            unsaved: t('builder-unsaved'),
            validation: t('builder-validation'),
            close: t('builder-close'),
            search: t('builder-search'),
            noMatches: t('builder-no-matches'),
            noSaved: t('builder-no-saved'),
            monday: t('days.monday'),
            tuesday: t('days.tuesday'),
            wednesday: t('days.wednesday'),
            thursday: t('days.thursday'),
            friday: t('days.friday'),
            saturday: t('days.saturday'),
            sunday: t('days.sunday'),
          }}
        />
      )}
      <ExerciseDetailsDrawer
        exercise={selected}
        categoryLabel={selected ? getCategoryLabel(selected.category) : undefined}
        saved={selected ? savedIds.has(selected.id) : false}
        saving={selected ? savingId === selected.id : false}
        onClose={() => setSelected(null)}
        onToggleSave={() => selected && void toggleSave(selected.id)}
        labels={{
          close: t('close'),
          previous: t('previous-image'),
          next: t('next-image'),
          save: t('save-long'),
          remove: t('remove-long'),
        }}
      />
    </main>
  );
}

/** Shared presentation for loading, error, no-results, and empty-library messages. */
function Status({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-orange-200 bg-white/60 p-8 text-center text-neutral-600"
      role="status"
    >
      {children}
    </div>
  );
}

/** Decorative icon used by the My Exercises empty state. */
function BookmarkIcon() {
  return <Dumbbell className="h-10 w-10 text-orange-400" aria-hidden />;
}
