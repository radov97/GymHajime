'use client';

import { Loader } from 'lucide-react';
import { ButtonType, ButtonRank } from '@/lib/enums';

export default function Button({
  type = ButtonType.Button,
  text,
  rank = ButtonRank.Primary,
  disabled = false,
  loading = false,
  className = '',
  ...props
}) {
  const baseStyles = 'w-full font-semibold py-2 rounded transition-all duration-200 ease-in-out';
  const getRankStyles = (rank) => {
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
