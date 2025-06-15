'use client';

import { useState } from 'react';
import ModalPopupPalco from '../components/ModalPopupPalco';
import { ButtonRank, ButtonType } from '@/lib/enums';

export default {
  title: 'ModalPopupPalco',
  component: ModalPopupPalco,
};

export function Default() {
  const [open, setOpen] = useState(true);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-[var(--color-palco)] text-white rounded"
      >
        Open Modal
      </button>

      <ModalPopupPalco
        isOpen={open}
        title="Reset Password"
        onClose={() => setOpen(false)}
        buttons={[
          {
            text: 'Cancel',
            onClick: () => setOpen(false),
            rank: ButtonRank.Secondary,
          },
          {
            text: 'Send Reset Link',
            onClick: () => alert('Reset link sent'),
            type: ButtonType.Button,
            rank: ButtonRank.Primary,
          },
        ]}
      >
        <p className="text-sm text-gray-600 mb-2">
          Enter your email to receive a password reset link.
        </p>
        <input
          type="email"
          placeholder="you@example.com"
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
        />
      </ModalPopupPalco>
    </>
  );
}
