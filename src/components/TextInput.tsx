import { X } from 'lucide-react';
import type { ReactNode } from 'react';

export interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  label?: string;
  placeholder?: string;
  type?: 'text' | 'search';
  leadingIcon?: ReactNode;
  onClear?: () => void;
  clearLabel?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
}

/**
 * Shared GymHajime text field with an optional visible label, leading icon, and clear action.
 * Consumers retain ownership of the controlled value and decide whether clearing is available.
 */
export default function TextInput({
  value,
  onChange,
  ariaLabel,
  label,
  placeholder,
  type = 'text',
  leadingIcon,
  onClear,
  clearLabel,
  disabled = false,
  autoFocus = false,
  className = '',
}: TextInputProps) {
  const control = (
    <div className="relative min-w-0">
      {leadingIcon && (
        <span
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
          aria-hidden
        >
          {leadingIcon}
        </span>
      )}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        disabled={disabled}
        autoFocus={autoFocus}
        className={`w-full rounded-xl border border-orange-100 bg-white py-2.5 text-sm font-normal text-neutral-900 shadow-sm outline-none transition placeholder:text-neutral-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-400 ${leadingIcon ? 'pl-10' : 'pl-3'} ${onClear ? 'pr-10' : 'pr-3'}`}
      />
      {onClear && value && (
        <button
          type="button"
          onClick={onClear}
          aria-label={clearLabel ?? 'Clear'}
          disabled={disabled}
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-neutral-400 hover:text-neutral-900 disabled:cursor-not-allowed"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );

  return label ? (
    <label className={`grid min-w-0 gap-2 text-sm font-bold text-neutral-700 ${className}`}>
      {label}
      {control}
    </label>
  ) : (
    <div className={`min-w-0 ${className}`}>{control}</div>
  );
}
