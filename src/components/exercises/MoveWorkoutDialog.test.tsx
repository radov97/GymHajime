import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import MoveWorkoutDialog from './MoveWorkoutDialog';

const labels = {
  move: 'Move Workout',
  moveTarget: 'Move to day',
  moveWarning: 'The target workout will be replaced.',
  cancel: 'Cancel',
  confirmMove: 'Move Workout',
  moving: 'Moving...',
};
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

describe('MoveWorkoutDialog', () => {
  it('renders nothing while closed', () => {
    const { container } = render(
      <MoveWorkoutDialog
        open={false}
        sourceDay={1}
        targetDay={2}
        dayLabels={days}
        labels={labels}
        moving={false}
        onTargetChange={vi.fn()}
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('warns about replacement and disables the source weekday', () => {
    render(
      <MoveWorkoutDialog
        open
        sourceDay={1}
        targetDay={2}
        dayLabels={days}
        labels={labels}
        moving={false}
        onTargetChange={vi.fn()}
        onCancel={vi.fn()}
        onConfirm={vi.fn()}
      />
    );
    expect(screen.getByRole('dialog', { name: 'Move Workout' })).toBeInTheDocument();
    expect(screen.getByText('The target workout will be replaced.')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Monday' })).toBeDisabled();
  });

  it('reports target, cancel, and confirmation actions', () => {
    const onTargetChange = vi.fn();
    const onCancel = vi.fn();
    const onConfirm = vi.fn();
    render(
      <MoveWorkoutDialog
        open
        sourceDay={1}
        targetDay={2}
        dayLabels={days}
        labels={labels}
        moving={false}
        onTargetChange={onTargetChange}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    );
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '3' } });
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    fireEvent.click(screen.getByRole('button', { name: 'Move Workout' }));
    expect(onTargetChange).toHaveBeenCalledWith(3);
    expect(onCancel).toHaveBeenCalledOnce();
    expect(onConfirm).toHaveBeenCalledOnce();
  });
});
