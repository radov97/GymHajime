'use client';

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ModalPopup, { type ModalPopupProps } from '../components/ModalPopup';
import { ButtonRank, ButtonType } from '../lib/enums';
import Input from '../components/Input';

const meta = {
  title: 'ModalPopup',
  component: ModalPopup,
  render: function Render(args: ModalPopupProps) {
    const [open, setOpen] = useState(args.isOpen);
    const buttons = args.buttons?.map((button) => ({
      ...button,
      onClick: () => {
        if (button.text.toLowerCase().includes('cancel')) setOpen(false);
      },
    }));

    return (
      <>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-[var(--color-brand)] text-white rounded"
        >
          Open Modal
        </button>
        <ModalPopup {...args} isOpen={open} buttons={buttons} onClose={() => setOpen(false)} />
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
    subtitle: 'Enter your email to receive a password reset link.',
    children: <Input type="email" placeholder="you@example.com" className="text-sm" />,
    buttons: [
      { text: 'Cancel', rank: ButtonRank.Secondary },
      { text: 'Send Reset Link', type: ButtonType.Button, rank: ButtonRank.Primary },
    ],
  },
};

export const Closed: Story = {
  args: {
    ...Default.args,
    isOpen: false,
  },
};

export const SingleAction: Story = {
  args: {
    isOpen: true,
    title: 'Workout saved',
    children: <p>Your personalised routine is ready.</p>,
    buttons: [{ text: 'Continue', rank: ButtonRank.Primary }],
  },
};

export const LoadingAction: Story = {
  args: {
    isOpen: true,
    title: 'Saving workout',
    children: <p>Please wait while your exercise sets are saved.</p>,
    buttons: [
      { text: 'Cancel', rank: ButtonRank.Secondary, disabled: true },
      { text: 'Saving', rank: ButtonRank.Primary, loading: true },
    ],
  },
};

export const WithoutTitle: Story = {
  args: {
    isOpen: true,
    children: <p>Are you sure you want to remove this exercise?</p>,
    buttons: [
      { text: 'Cancel', rank: ButtonRank.Secondary },
      { text: 'Remove exercise', rank: ButtonRank.Primary },
    ],
  },
};

export const ContentOnly: Story = {
  args: {
    isOpen: true,
    title: 'Rest timer complete',
    children: <p>Start your next set when you are ready.</p>,
    buttons: [],
  },
};
