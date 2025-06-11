'use client';

import { Loader } from 'lucide-react';
import { ButtonType, ButtonRank } from '@/lib/enums';

export default function ButtonPalco({
  type = ButtonType.Submit,
  text,
  rank = ButtonRank.Primary,
  disabled = false,
  loading = false,
  className = '',
  ...props
}) {
  const baseStyles = 'w-full font-semibold py-2 rounded hover:opacity-90 transition';
  const getRankStyles = (rank) => {
    switch (rank) {
      case ButtonRank.Primary:
        return 'bg-[var(--color-palco)] text-white';
      case ButtonRank.Secondary:
        return 'bg-gray-200 text-gray-800';
      default:
        return '';
    }
  };

  const computedClasses = [
    baseStyles,
    getRankStyles(rank),
    className,
    disabled ? 'opacity-60 cursor-not-allowed' : '',
  ].join(' ');

  return (
    <button type={type} disabled={disabled || loading} className={computedClasses} {...props}>
      {loading ? <Loader className="animate-spin w-5 h-5 mx-auto" /> : text}
    </button>
  );
}
