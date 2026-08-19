'use client';

import { useState } from 'react';
import ModalPopup from '../components/ModalPopup';
import { ButtonRank, ButtonType } from '@/lib/enums';
import Input from '@/components/Input';

export default {
  title: 'ModalPopup',
  component: ModalPopup,
};

export function Default() {
  const [open, setOpen] = useState(true);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-[var(--color-brand)] text-white rounded"
      >
        Open Modal
      </button>

      <ModalPopup
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
        <Input type="email" placeholder="you@example.com" className="text-sm" onChange={() => {}} />
      </ModalPopup>
    </>
  );
}
