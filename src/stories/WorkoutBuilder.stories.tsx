import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import WorkoutBuilder, {
  type WorkoutBuilderLabels,
  type WorkoutBuilderProps,
} from '../components/exercises/WorkoutBuilder';
import { exerciseFixture } from '@/dummy/exerciseFixture';
import type { Exercise } from '@/types/exercises';
import type { Workout } from '@/types/workouts';

type LoadWorkout = NonNullable<WorkoutBuilderProps['loadWorkout']>;
type PersistWorkout = NonNullable<WorkoutBuilderProps['persistWorkout']>;
type ClearWorkout = NonNullable<WorkoutBuilderProps['clearPersistedWorkout']>;
type MoveWorkout = NonNullable<WorkoutBuilderProps['movePersistedWorkout']>;

const savedExercises: Exercise[] = [
  exerciseFixture,
  {
    ...exerciseFixture,
    id: '2f8c6bbc-1508-4f64-9ef8-0a78926d55e1',
    name: 'Incline Dumbbell Press',
    images: [],
  },
  {
    ...exerciseFixture,
    id: '65aa19a2-e999-46ab-b791-2611d764ece9',
    name: 'Cable Fly',
    images: [],
  },
];

const labels: WorkoutBuilderLabels = {
  builder: 'Workout Builder',
  day: 'Day',
  workoutName: 'Workout name',
  namePlaceholder: 'e.g. Chest',
  add: 'Add Exercise',
  loading: 'Loading workout...',
  error: "We couldn't load the workout.",
  retry: 'Try again',
  empty: 'No exercises configured for __DAY__.',
  exercise: 'Exercise',
  sets: 'Sets',
  reps: 'Reps',
  weight: 'Weight (kg)',
  duration: 'Duration (minutes)',
  actions: 'Actions',
  up: 'Move up',
  down: 'Move down',
  remove: 'Remove',
  save: 'Save Workout',
  saving: 'Saving...',
  unsaved: 'Discard your unsaved changes and change day?',
  validation: 'Sets and reps must be positive whole numbers, and weight cannot be negative.',
  close: 'Close exercise picker',
  search: 'Search saved exercises...',
  noMatches: 'No matching saved exercises.',
  noSaved: 'Save exercises in My Exercises before adding them to a workout.',
  move: 'Move Workout',
  moveTarget: 'Move to day',
  moveWarning:
    'This moves the entire workout. Any workout already saved for the target day will be permanently replaced.',
  confirmMove: 'Move Workout',
  moving: 'Moving...',
  moveUnsaved: 'Save or discard your unsaved changes before moving this workout.',
  moveError: "We couldn't move the workout.",
  clear: 'Clear Day',
  clearConfirm: 'Permanently clear all workout data saved for __DAY__?',
  clearError: "We couldn't clear the workout.",
  cancel: 'Cancel',
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

const configuredWorkout: Workout = {
  id: 'dc6819ea-935c-45f4-965c-0aac7f173814',
  dayOfWeek: 1,
  name: 'Chest',
  exercises: savedExercises.slice(0, 2).map((exercise, index) => ({
    id: `f0a85ad8-29ef-47ff-9cbb-5101f72a1f0${index}`,
    exerciseId: exercise.id,
    name: exercise.name,
    category: exercise.category,
    imageUrl: exercise.images[0]?.url ?? null,
    sets: index === 0 ? 4 : 3,
    reps: index === 0 ? 8 : 10,
    weight: index === 0 ? 60 : 22.5,
    durationMinutes: null,
    sortOrder: index + 1,
  })),
};

const meta = {
  title: 'Exercises/WorkoutBuilder',
  component: WorkoutBuilder,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-[var(--color-brand-soft)] p-10">
        <Story />
      </div>
    ),
  ],
  args: {
    locale: 'en',
    savedExercises,
    categoryLabel: (category) => category.charAt(0).toUpperCase() + category.slice(1),
    labels,
    loadWorkout: fn(async () => ({ workout: null })) as LoadWorkout,
    persistWorkout: fn(async () => ({ workout: configuredWorkout })) as PersistWorkout,
    clearPersistedWorkout: fn(async () => ({ workout: null })) as ClearWorkout,
    movePersistedWorkout: fn(async () => ({
      workout: { ...configuredWorkout, dayOfWeek: 2 },
    })) as MoveWorkout,
  },
} satisfies Meta<typeof WorkoutBuilder>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A weekday does not create a database record merely by being viewed. */
export const EmptyDay: Story = {};

/** A hydrated workout with editable values and ordering controls. */
export const ConfiguredDay: Story = {
  args: {
    loadWorkout: fn(async () => ({ workout: configuredWorkout })) as LoadWorkout,
  },
};

/** Documents the primary add-from-saved-library interaction. */
export const ExercisePicker: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(canvas.getByText('No exercises configured for Monday.')).toBeVisible()
    );
    await userEvent.click(canvas.getAllByRole('button', { name: 'Add Exercise' })[0]);
    const dialog = within(document.body).getByRole('dialog', { name: 'Add Exercise' });
    await expect(within(dialog).getByText('Barbell Bench Press')).toBeVisible();
  },
};

/** Shows the picker guidance when the personal library is empty. */
export const EmptySavedLibrary: Story = {
  args: { savedExercises: [] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() =>
      expect(canvas.getByText('No exercises configured for Monday.')).toBeVisible()
    );
    await userEvent.click(canvas.getAllByRole('button', { name: 'Add Exercise' })[0]);
    await expect(
      within(document.body).getByText(
        'Save exercises in My Exercises before adding them to a workout.'
      )
    ).toBeVisible();
  },
};
