'use client';

import { ButtonRank, ButtonType } from '../lib/enums';
import { useEffect, type ReactNode } from 'react';
import Button, { type ButtonProps } from './Button';
import FormContainer from './FormContainer';
import { X } from 'lucide-react';

export interface ModalButton extends Omit<ButtonProps, 'text'> {
  text: string;
}

export interface ModalPopupProps {
  isOpen: boolean;
  children?: ReactNode;
  title?: string;
  subtitle?: ReactNode;
  buttons?: ModalButton[];
  onClose?: () => void;
  closeLabel?: string;
}

export default function ModalPopup({
  isOpen,
  children,
  title,
  subtitle,
  buttons = [],
  onClose,
  closeLabel = 'Close modal',
}: ModalPopupProps) {
  useEffect(() => {
    if (!isOpen) return;

    // Preserve the caller's overflow setting so closing or unmounting the modal
    // restores the page exactly as it was before the scroll lock was applied.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <FormContainer
        className="relative max-h-[calc(100vh-2rem)] overflow-y-auto bg-[var(--color-brand-modal-bg)]"
        noBg={true}
      >
        {onClose && (
          <button
            type="button"
            aria-label={closeLabel}
            onClick={onClose}
            className="absolute right-4 top-4 rounded-md p-1 text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
        {title && (
          <h2 className="pr-8 text-2xl font-bold text-[var(--color-brand-ink)] mb-2 text-left cursor-default">
            {title}
          </h2>
        )}

        {subtitle && <p className="mb-6 text-gray-700">{subtitle}</p>}
        {children && <div className="mb-6">{children}</div>}

        <div className="flex justify-end gap-2">
          {buttons.map((btn, idx) => (
            <Button
              key={idx}
              type={btn.type || ButtonType.Button}
              rank={btn.rank || ButtonRank.Primary}
              onClick={btn.onClick}
              className={btn.className || ''}
              disabled={btn.disabled || false}
              loading={btn.loading || false}
              text={btn.text || ''}
            />
          ))}
        </div>
      </FormContainer>
    </div>
  );
}
