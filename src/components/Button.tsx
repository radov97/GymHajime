'use client';

import { Loader } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { ButtonType, ButtonRank, type ButtonRankValue, type ButtonTypeValue } from '../lib/enums';

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
  const baseStyles =
    'w-full cursor-pointer whitespace-nowrap rounded-xl border px-5 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-40';
  const getRankStyles = (rank: ButtonRankValue) => {
    switch (rank) {
      case ButtonRank.Primary:
        return 'border-orange-500 bg-orange-500 text-white hover:bg-orange-600';
      case ButtonRank.Secondary:
        return 'border-orange-300 bg-white text-orange-600 hover:bg-orange-50';
      case ButtonRank.Danger:
        return 'border-red-200 bg-white text-red-600 hover:bg-red-50';
      case ButtonRank.Link:
        return 'border-orange-300 bg-[var(--color-brand-soft)] text-orange-600 hover:bg-orange-50';
      default:
        return '';
    }
  };

  const computedClasses = [baseStyles, getRankStyles(rank), className].join(' ');

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={computedClasses}
      aria-label={loading && typeof text === 'string' ? text : undefined}
      {...props}
    >
      {loading ? <Loader className="animate-spin w-5 h-5 mx-auto" aria-hidden /> : text}
    </button>
  );
}
