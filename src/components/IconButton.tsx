import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type IconButtonVariant = 'primary' | 'outline' | 'danger' | 'ghost';

export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'> {
  icon: ReactNode;
  label: string;
  variant?: IconButtonVariant;
  /** Hides the visual label while retaining it as the button's accessible name. */
  iconOnly?: boolean;
}

const variantClasses: Record<IconButtonVariant, string> = {
  primary: 'border-orange-500 bg-orange-500 px-5 text-white hover:bg-orange-600',
  outline: 'border-orange-300 bg-white px-4 text-orange-600 hover:bg-orange-50',
  danger: 'border-red-200 bg-white px-4 text-red-600 hover:bg-red-50',
  ghost:
    'border-transparent bg-transparent px-2 text-neutral-600 hover:bg-orange-50 hover:text-orange-600',
};

/** GymHajime action button combining a decorative icon with a visible accessible label. */
export default function IconButton({
  icon,
  label,
  variant = 'primary',
  iconOnly = false,
  className = '',
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={iconOnly ? label : props['aria-label']}
      className={`flex cursor-pointer items-center rounded-xl border py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-40 ${iconOnly ? 'justify-center' : 'gap-2'} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      <span className="flex items-center justify-center" aria-hidden>
        {icon}
      </span>
      {!iconOnly && label}
    </button>
  );
}
