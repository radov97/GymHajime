'use client';

import Image from 'next/image';
import type { ButtonHTMLAttributes } from 'react';

export interface GoogleButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  text?: string;
  width?: number;
  height?: number;
}

export default function GoogleButton({
  text = 'Sign up with Google',
  width = 40,
  height = 40,
  onClick,
  disabled = false,
  ...props
}: GoogleButtonProps) {
  const baseStyles =
    'w-full font-semibold py-2 rounded transition-all duration-200 ease-in-out flex items-center justify-center gap-2 mb-6 border';
  const isInteractive = !disabled;

  const computedClasses = [
    baseStyles,
    'bg-[#fbfafb]',
    isInteractive
      ? 'cursor-pointer hover:opacity-90 hover:brightness-110 hover:scale-[1.01] hover:shadow-md'
      : 'opacity-60 cursor-not-allowed',
    'text-[var(--color-brand-dark)] border-[var(--color-brand-dark)]',
  ].join(' ');

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={computedClasses}
      {...props}
    >
      <Image src="/google-icon.png" alt="Google" width={width} height={height} />
      <span>{text}</span>
    </button>
  );
}
