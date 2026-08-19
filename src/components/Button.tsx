'use client';

import { Loader } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { ButtonType, ButtonRank, type ButtonRankValue, type ButtonTypeValue } from '@/lib/enums';

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'children'> {
  type?: ButtonTypeValue;
  text: ReactNode;
  rank?: ButtonRankValue;
  loading?: boolean;
}

export default function Button({
  type = ButtonType.Button,
  text,
  rank = ButtonRank.Primary,
  disabled = false,
  loading = false,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'w-full font-semibold py-2 rounded transition-all duration-200 ease-in-out';
  const getRankStyles = (rank: ButtonRankValue) => {
    switch (rank) {
      case ButtonRank.Primary:
        return 'bg-[var(--color-brand)] text-white';
      case ButtonRank.Secondary:
        return 'bg-gray-200 text-gray-800';
      case ButtonRank.Link:
        return 'bg-[var(--color-brand-soft)] text-[var(--color-brand)] border border-[var(--color-brand)]';
      default:
        return '';
    }
  };

  const isInteractive = !disabled && !loading;

  const computedClasses = [
    baseStyles,
    getRankStyles(rank),
    className,
    isInteractive
      ? 'cursor-pointer hover:opacity-90 hover:brightness-110 hover:scale-[1.01] hover:shadow-md'
      : 'opacity-60 cursor-not-allowed',
  ].join(' ');

  return (
    <button type={type} disabled={disabled || loading} className={computedClasses} {...props}>
      {loading ? <Loader className="animate-spin w-5 h-5 mx-auto" /> : text}
    </button>
  );
}
