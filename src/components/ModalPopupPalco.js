'use client';

import { ButtonRank, ButtonType } from '@/lib/enums';
import ButtonPalco from './ButtonPalco';
import FormContainerPalco from './FormContainerPalco';

export default function ModalPopupPalco({ isOpen, children, title, buttons = [] }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <FormContainerPalco className="bg-[var(--color-palco-modal-bg)]" noBg={true}>
        {title && (
          <h2 className="text-2xl font-bold text-[var(--color-palco-black)] mb-2 text-left cursor-default">
            {title}
          </h2>
        )}

        <div className="mb-6">{children}</div>

        <div className="flex justify-end gap-2">
          {buttons.map((btn, idx) => (
            <ButtonPalco
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
      </FormContainerPalco>
    </div>
  );
}
