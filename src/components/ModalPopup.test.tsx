import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ModalPopup from './ModalPopup';
import { ButtonRank } from '../lib/enums';

describe('ModalPopup', () => {
  it('renders nothing while closed', () => {
    const { container } = render(<ModalPopup isOpen={false}>Hidden</ModalPopup>);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders content and invokes configured actions', () => {
    const onConfirm = vi.fn();
    render(
      <ModalPopup
        isOpen
        title="Delete exercise"
        buttons={[{ text: 'Delete', onClick: onConfirm, rank: ButtonRank.Primary }]}
      >
        This cannot be undone.
      </ModalPopup>
    );

    expect(screen.getByRole('heading', { name: 'Delete exercise' })).toBeInTheDocument();
    expect(screen.getByText('This cannot be undone.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('supports a loading action', () => {
    render(
      <ModalPopup isOpen buttons={[{ text: 'Saving', loading: true }]}>
        Saving workout
      </ModalPopup>
    );
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
