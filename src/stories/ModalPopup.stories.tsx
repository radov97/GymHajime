'use client';

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ModalPopup, { type ModalPopupProps } from '../components/ModalPopup';
import { ButtonRank, ButtonType } from '@/lib/enums';
import Input from '@/components/Input';

const meta = {
  title: 'ModalPopup',
  component: ModalPopup,
  render: function Render(args: ModalPopupProps) {
    const [open, setOpen] = useState(args.isOpen);

    return (
      <>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-[var(--color-brand)] text-white rounded"
        >
          Open Modal
        </button>
        <ModalPopup
          {...args}
          isOpen={open}
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
        />
      </>
    );
  },
} satisfies Meta<typeof ModalPopup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    title: 'Reset Password',
    children: (
      <>
        <p className="text-sm text-gray-600 mb-2">
          Enter your email to receive a password reset link.
        </p>
        <Input type="email" placeholder="you@example.com" className="text-sm" />
      </>
    ),
  },
};
