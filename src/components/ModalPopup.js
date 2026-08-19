'use client';

import { ButtonRank, ButtonType } from '@/lib/enums';
import Button from './Button';
import FormContainer from './FormContainer';

export default function ModalPopup({ isOpen, children, title, buttons = [] }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <FormContainer className="bg-[var(--color-brand-modal-bg)]" noBg={true}>
        {title && (
          <h2 className="text-2xl font-bold text-[var(--color-brand-ink)] mb-2 text-left cursor-default">
            {title}
          </h2>
        )}

        <div className="mb-6">{children}</div>

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
