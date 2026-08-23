'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, Loader, Plus } from 'lucide-react';
import SelectDropdown from '@/components/SelectDropdown';
import TextInput from '@/components/TextInput';
import { getWorkout, saveWorkout } from '@/api/workouts';
import type { Exercise } from '@/types/exercises';
import type { WorkoutExercise } from '@/types/workouts';
import SavedExercisePicker from './SavedExercisePicker';
import WorkoutExerciseTable from './WorkoutExerciseTable';

/** Text is supplied by ExercisesPage so the builder remains independent of next-intl. */
export interface WorkoutBuilderLabels {
  [key: string]: string;
}

export interface WorkoutBuilderProps {
  locale: string;
  savedExercises: Exercise[];
  categoryLabel: (category: string) => string;
  labels: WorkoutBuilderLabels;
  /** Injectable API boundaries keep stories deterministic while production uses HTTP helpers. */
  loadWorkout?: typeof getWorkout;
  persistWorkout?: typeof saveWorkout;
}

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

/**
 * Edits one weekday at a time as a local draft and persists only when Save Workout is pressed.
 * Exercise choices come exclusively from the saved library supplied by the parent component.
 */
export default function WorkoutBuilder({
  locale,
  savedExercises,
  categoryLabel,
  labels,
  loadWorkout = getWorkout,
  persistWorkout = saveWorkout,
}: WorkoutBuilderProps) {
  const [day, setDay] = useState(1);
  const [rows, setRows] = useState<WorkoutExercise[]>([]);
  const [name, setName] = useState('');
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState('');
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let current = true;
    setLoading(true);
    setError(null);
    void loadWorkout(day, locale)
      .then(({ workout }) => {
        if (!current) return;
        setRows(workout?.exercises ?? []);
        setName(workout?.name ?? '');
        setDirty(false);
      })
      .catch(
        (reason) => current && setError(reason instanceof Error ? reason.message : labels.error)
      )
      .finally(() => current && setLoading(false));
    return () => {
      current = false;
    };
  }, [day, labels.error, loadWorkout, locale, retry]);

  const unavailable = useMemo(() => new Set(rows.map((row) => row.exerciseId)), [rows]);
  const choices = useMemo(() => {
    const query = search.trim().toLocaleLowerCase(locale);
    return savedExercises.filter(
      (exercise) =>
        !unavailable.has(exercise.id) &&
        (!query ||
          `${exercise.name} ${categoryLabel(exercise.category)}`
            .toLocaleLowerCase(locale)
            .includes(query))
    );
  }, [categoryLabel, locale, savedExercises, search, unavailable]);

  /** Protects a dirty weekday draft from being silently replaced by another day. */
  function changeDay(next: number) {
    if (next === day) return;
    if (dirty && !window.confirm(labels.unsaved)) return;
    setDay(next);
  }

  function update(index: number, patch: Partial<WorkoutExercise>) {
    setRows((current) =>
      current.map((row, rowIndex) => (rowIndex === index ? { ...row, ...patch } : row))
    );
    setDirty(true);
  }

  /** Moves a row one position and immediately normalizes the local one-based order. */
  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= rows.length) return;
    setRows((current) => {
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next.map((row, rowIndex) => ({ ...row, sortOrder: rowIndex + 1 }));
    });
    setDirty(true);
  }

  function add(exercise: Exercise) {
    setRows((current) => [
      ...current,
      {
        id: `draft-${exercise.id}`,
        exerciseId: exercise.id,
        name: exercise.name,
        category: exercise.category,
        imageUrl: exercise.images[0]?.url ?? null,
        sets: 3,
        reps: 10,
        weight: null,
        sortOrder: current.length + 1,
      },
    ]);
    setDirty(true);
    setModal(false);
    setSearch('');
  }

  function remove(index: number) {
    setRows((current) =>
      current
        .filter((_, rowIndex) => rowIndex !== index)
        .map((row, rowIndex) => ({ ...row, sortOrder: rowIndex + 1 }))
    );
    setDirty(true);
  }

  /** Validates and sends the complete normalized draft rather than saving individual keystrokes. */
  async function persist() {
    if (
      rows.some(
        (row) =>
          !Number.isInteger(row.sets) ||
          row.sets < 1 ||
          !Number.isInteger(row.reps) ||
          row.reps < 1 ||
          (row.weight !== null && row.weight < 0)
      )
    ) {
      setError(labels.validation);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const result = await persistWorkout(day, locale, {
        name: name.trim() || null,
        exercises: rows.map((row, index) => ({
          exerciseId: row.exerciseId,
          sets: row.sets,
          reps: row.reps,
          weight: row.weight,
          sortOrder: index + 1,
        })),
      });
      setRows(result.workout?.exercises ?? []);
      setName(result.workout?.name ?? '');
      setDirty(false);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : labels.error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mt-8 min-w-[900px]" aria-label={labels.builder}>
      <div className="mb-6 flex items-end justify-between gap-8">
        <div className="flex items-end gap-5">
          <SelectDropdown
            value={String(day)}
            onChange={(value) => changeDay(Number(value))}
            ariaLabel={labels.day}
            label={labels.day}
            className="min-w-56"
            options={DAYS.map((key, index) => ({
              value: String(index + 1),
              label: labels[key],
            }))}
          />
          <TextInput
            value={name}
            onChange={(value) => {
              setName(value);
              setDirty(true);
            }}
            ariaLabel={labels.workoutName}
            label={labels.workoutName}
            placeholder={labels.namePlaceholder}
            className="w-72"
          />
        </div>
        <button
          type="button"
          onClick={() => setModal(true)}
          className="flex cursor-pointer items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-bold text-white hover:bg-orange-600"
        >
          <Plus className="h-5 w-5" />
          {labels.add}
        </button>
      </div>

      {loading ? (
        <State>
          <Loader className="h-8 w-8 animate-spin text-orange-500" />
          {labels.loading}
        </State>
      ) : error && rows.length === 0 ? (
        <State>
          <AlertCircle className="h-8 w-8 text-red-500" />
          {error}
          <button
            onClick={() => setRetry((value) => value + 1)}
            className="cursor-pointer font-bold text-orange-600"
          >
            {labels.retry}
          </button>
        </State>
      ) : rows.length === 0 ? (
        <State>
          <span className="font-bold">
            {labels.empty.replace('__DAY__', labels[DAYS[day - 1]])}
          </span>
          <button
            type="button"
            onClick={() => setModal(true)}
            className="cursor-pointer font-bold text-orange-600"
          >
            {labels.add}
          </button>
        </State>
      ) : (
        <WorkoutExerciseTable
          exercises={rows}
          categoryLabel={categoryLabel}
          labels={labels}
          onUpdate={update}
          onMove={move}
          onRemove={remove}
        />
      )}
      {error && rows.length > 0 && (
        <p role="alert" className="mt-4 flex items-center gap-2 text-sm font-semibold text-red-600">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          disabled={!dirty || saving || loading}
          onClick={() => void persist()}
          className="cursor-pointer rounded-xl bg-orange-500 px-7 py-3 font-bold text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? labels.saving : labels.save}
        </button>
      </div>

      <SavedExercisePicker
        open={modal}
        exercises={choices}
        hasSavedExercises={savedExercises.length > 0}
        search={search}
        categoryLabel={categoryLabel}
        labels={labels}
        onSearchChange={setSearch}
        onAdd={add}
        onClose={() => setModal(false)}
      />
    </section>
  );
}

function State({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="status"
      className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-orange-200 bg-white/60 p-8 text-center text-neutral-600"
    >
      {children}
    </div>
  );
}
