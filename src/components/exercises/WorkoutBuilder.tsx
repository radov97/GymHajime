'use client';

import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, ArrowDown, ArrowUp, Loader, Plus, Search, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import { getWorkout, saveWorkout } from '@/api/workouts';
import type { Exercise } from '@/types/exercises';
import type { WorkoutExercise } from '@/types/workouts';

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
          <label className="grid gap-2 text-sm font-bold text-neutral-700">
            {labels.day}
            <select
              aria-label={labels.day}
              value={day}
              onChange={(event) => changeDay(Number(event.target.value))}
              className="min-w-56 rounded-xl border border-orange-200 bg-white px-4 py-3 text-base text-neutral-900 outline-none focus:border-orange-500"
            >
              {DAYS.map((key, index) => (
                <option key={key} value={index + 1}>
                  {labels[key]}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-bold text-neutral-700">
            {labels.workoutName}
            <input
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setDirty(true);
              }}
              placeholder={labels.namePlaceholder}
              className="w-72 rounded-xl border border-orange-200 bg-white px-4 py-3 font-normal outline-none focus:border-orange-500"
            />
          </label>
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
        <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
          <table className="w-full table-fixed text-left">
            <thead className="bg-orange-50 text-xs uppercase tracking-wide text-neutral-600">
              <tr>
                <th className="w-[42%] px-5 py-4">{labels.exercise}</th>
                <th className="w-[12%] px-3 py-4">{labels.sets}</th>
                <th className="w-[12%] px-3 py-4">{labels.reps}</th>
                <th className="w-[15%] px-3 py-4">{labels.weight}</th>
                <th className="px-3 py-4">{labels.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-orange-100">
              {rows.map((row, index) => (
                <tr key={row.exerciseId}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {row.imageUrl ? (
                        <Image
                          src={row.imageUrl}
                          alt=""
                          width={56}
                          height={56}
                          className="h-14 w-14 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-14 w-14 rounded-lg bg-orange-50" />
                      )}
                      <div>
                        <strong className="block text-neutral-900">{row.name}</strong>
                        <span className="text-sm text-neutral-500">
                          {categoryLabel(row.category)}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-3">
                    <NumberInput
                      label={`${row.name} ${labels.sets}`}
                      value={row.sets}
                      min={1}
                      step={1}
                      onChange={(value) => update(index, { sets: value })}
                    />
                  </td>
                  <td className="px-3">
                    <NumberInput
                      label={`${row.name} ${labels.reps}`}
                      value={row.reps}
                      min={1}
                      step={1}
                      onChange={(value) => update(index, { reps: value })}
                    />
                  </td>
                  <td className="px-3">
                    <input
                      aria-label={`${row.name} ${labels.weight}`}
                      type="number"
                      min="0"
                      step="0.25"
                      value={row.weight ?? ''}
                      placeholder="—"
                      onChange={(event) =>
                        update(index, {
                          weight: event.target.value === '' ? null : Number(event.target.value),
                        })
                      }
                      className="w-24 rounded-lg border border-neutral-200 px-3 py-2 outline-none focus:border-orange-500"
                    />
                  </td>
                  <td className="px-3">
                    <div className="flex gap-1">
                      <IconButton
                        label={labels.up}
                        disabled={index === 0}
                        onClick={() => move(index, -1)}
                      >
                        <ArrowUp />
                      </IconButton>
                      <IconButton
                        label={labels.down}
                        disabled={index === rows.length - 1}
                        onClick={() => move(index, 1)}
                      >
                        <ArrowDown />
                      </IconButton>
                      <IconButton label={labels.remove} onClick={() => remove(index)} danger>
                        <Trash2 />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-8"
          role="presentation"
          onMouseDown={(event) => event.target === event.currentTarget && setModal(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-exercise-title"
            className="max-h-[78vh] w-[720px] overflow-hidden rounded-2xl bg-[var(--color-brand-soft)] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-orange-100 px-6 py-5">
              <h2
                id="add-exercise-title"
                className="text-xl font-bold text-[var(--color-brand-ink)]"
              >
                {labels.add}
              </h2>
              <button
                aria-label={labels.close}
                onClick={() => setModal(false)}
                className="cursor-pointer rounded-lg p-2 hover:bg-orange-100"
              >
                <X />
              </button>
            </div>
            <div className="p-6">
              <label className="flex items-center gap-3 rounded-xl border border-orange-200 bg-white px-4">
                <Search className="h-5 w-5 text-neutral-400" />
                <input
                  autoFocus
                  aria-label={labels.search}
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={labels.search}
                  className="w-full py-3 outline-none"
                />
              </label>
              <div className="mt-4 max-h-[50vh] space-y-2 overflow-y-auto">
                {choices.length ? (
                  choices.map((exercise) => (
                    <button
                      key={exercise.id}
                      type="button"
                      onClick={() => add(exercise)}
                      className="flex w-full cursor-pointer items-center gap-4 rounded-xl border border-transparent bg-white p-3 text-left hover:border-orange-300 hover:bg-orange-50"
                    >
                      {exercise.images[0] ? (
                        <Image
                          src={exercise.images[0].url}
                          alt=""
                          width={56}
                          height={56}
                          className="h-14 w-14 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-14 w-14 rounded-lg bg-orange-50" />
                      )}
                      <span>
                        <strong className="block">{exercise.name}</strong>
                        <span className="text-sm text-neutral-500">
                          {categoryLabel(exercise.category)}
                        </span>
                      </span>
                      <Plus className="ml-auto text-orange-500" />
                    </button>
                  ))
                ) : (
                  <p className="py-12 text-center text-neutral-500">
                    {savedExercises.length ? labels.noMatches : labels.noSaved}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function NumberInput({
  label,
  value,
  min,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <input
      aria-label={label}
      type="number"
      value={value}
      min={min}
      step={step}
      onChange={(event) => onChange(Number(event.target.value))}
      className="w-20 rounded-lg border border-neutral-200 px-3 py-2 outline-none focus:border-orange-500"
    />
  );
}

function IconButton({
  label,
  disabled,
  onClick,
  danger,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  danger?: boolean;
  children: React.ReactElement<{ className?: string }>;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={`cursor-pointer rounded-lg p-2 disabled:cursor-not-allowed disabled:opacity-25 ${danger ? 'text-red-500 hover:bg-red-50' : 'text-neutral-500 hover:bg-orange-50 hover:text-orange-600'}`}
    >
      {children}
    </button>
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
