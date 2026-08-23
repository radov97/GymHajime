'use client';

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ExerciseDetailsDrawer from '../components/exercises/ExerciseDetailsDrawer';
import { exerciseFixture } from '@/dummy/exerciseFixture';

const labels = {
  close: 'Close exercise details',
  previous: 'Previous image',
  next: 'Next image',
  save: 'Add to My Exercises',
  remove: 'Remove from My Exercises',
};
const meta = {
  title: 'Exercises/ExerciseDetailsDrawer',
  component: ExerciseDetailsDrawer,
  parameters: { layout: 'fullscreen' },
  render: function Render(args) {
    const [open, setOpen] = useState(true);
    return (
      <>
        <button type="button" onClick={() => setOpen(true)}>
          Open details
        </button>
        <ExerciseDetailsDrawer
          {...args}
          exercise={open ? args.exercise : null}
          onClose={() => setOpen(false)}
        />
      </>
    );
  },
  args: {
    exercise: exerciseFixture,
    saved: false,
    saving: false,
    onClose: () => undefined,
    onToggleSave: () => undefined,
    labels,
  },
} satisfies Meta<typeof ExerciseDetailsDrawer>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Saved: Story = { args: { saved: true } };
export const Saving: Story = { args: { saving: true } };
