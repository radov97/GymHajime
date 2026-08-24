import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import MoveWorkoutDialog from '../components/exercises/MoveWorkoutDialog';

const meta = {
  title: 'Exercises/MoveWorkoutDialog',
  component: MoveWorkoutDialog,
  args: {
    open: true,
    sourceDay: 1,
    targetDay: 2,
    dayLabels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    labels: {
      move: 'Move Workout',
      moveTarget: 'Move to day',
      moveWarning:
        'This moves the entire workout. Any workout already saved for the target day will be permanently replaced.',
      cancel: 'Cancel',
      confirmMove: 'Move Workout',
      moving: 'Moving...',
    },
    moving: false,
    onTargetChange: fn(),
    onCancel: fn(),
    onConfirm: fn(),
  },
} satisfies Meta<typeof MoveWorkoutDialog>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Moving: Story = { args: { moving: true } };
