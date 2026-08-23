import { ChevronDown } from 'lucide-react';

export interface SelectDropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectDropdownOption[];
  ariaLabel: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Shared native select with an optional visible label and a consistent GymHajime chevron.
 * The native control preserves keyboard interaction while `appearance-none` removes browser-specific arrows.
 */
export default function SelectDropdown({
  value,
  onChange,
  options,
  ariaLabel,
  label,
  disabled = false,
  className = '',
}: SelectDropdownProps) {
  const control = (
    <div className="relative min-w-0">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={ariaLabel}
        disabled={disabled}
        className="w-full cursor-pointer appearance-none truncate rounded-xl border border-orange-100 bg-white px-3 py-2.5 pr-9 text-sm font-semibold text-neutral-700 shadow-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-400"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
        aria-hidden
      />
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
