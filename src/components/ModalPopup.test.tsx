import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ModalPopup from './ModalPopup';
import { ButtonRank } from '../lib/enums';

afterEach(() => {
  document.body.style.removeProperty('overflow');
});

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

  it('renders a subtitle and closes from the top-right button', () => {
    const onClose = vi.fn();
    render(
      <ModalPopup
        isOpen
        title="Confirm logout"
        subtitle="Are you sure you want to log out?"
        onClose={onClose}
      />
    );

    expect(screen.getByText('Are you sure you want to log out?')).toBeInTheDocument();
    const closeButton = screen.getByRole('button', { name: 'Close modal' });
    expect(closeButton).toHaveClass('text-red-600');
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('does not close from the backdrop by default', () => {
    const onClose = vi.fn();
    render(
      <ModalPopup isOpen title="Workout details" onClose={onClose}>
        Modal content
      </ModalPopup>
    );

    fireEvent.click(screen.getByTestId('modal-backdrop'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('closes from the backdrop when explicitly enabled', () => {
    const onClose = vi.fn();
    render(
      <ModalPopup isOpen title="Workout details" onClose={onClose} closeOnBackdropClick>
        Modal content
      </ModalPopup>
    );

    fireEvent.click(screen.getByTestId('modal-backdrop'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('does not close when its content is clicked', () => {
    const onClose = vi.fn();
    render(
      <ModalPopup isOpen title="Workout details" onClose={onClose}>
        Modal content
      </ModalPopup>
    );

    fireEvent.click(screen.getByText('Modal content'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('supports a loading action', () => {
    render(
      <ModalPopup isOpen buttons={[{ text: 'Saving', loading: true }]}>
        Saving workout
      </ModalPopup>
    );
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('locks page scrolling while open and restores the previous overflow value', () => {
    document.body.style.overflow = 'scroll';
    const { rerender } = render(<ModalPopup isOpen>Modal content</ModalPopup>);

    expect(document.body.style.overflow).toBe('hidden');

    rerender(<ModalPopup isOpen={false}>Modal content</ModalPopup>);
    expect(document.body.style.overflow).toBe('scroll');
  });

  it('restores page scrolling when an open modal unmounts', () => {
    document.body.style.overflow = 'auto';
    const { unmount } = render(<ModalPopup isOpen>Modal content</ModalPopup>);

    unmount();
    expect(document.body.style.overflow).toBe('auto');
  });
});
