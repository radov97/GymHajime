import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type IconButtonVariant = 'primary' | 'outline' | 'danger';

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'> {
  icon: ReactNode;
  label: string;
  variant?: IconButtonVariant;
}

const variantClasses: Record<IconButtonVariant, string> = {
  primary: 'border-orange-500 bg-orange-500 px-5 text-white hover:bg-orange-600',
  outline: 'border-orange-300 bg-white px-4 text-orange-600 hover:bg-orange-50',
  danger: 'border-red-200 bg-white px-4 text-red-600 hover:bg-red-50',
};

/** GymHajime action button combining a decorative icon with a visible accessible label. */
export default function IconButton({
  icon,
  label,
  variant = 'primary',
  className = '',
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      className={`flex cursor-pointer items-center gap-2 rounded-xl border py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-40 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      <span className="flex h-5 w-5 items-center justify-center" aria-hidden>
        {icon}
      </span>
      {label}
    </button>
  );
}
