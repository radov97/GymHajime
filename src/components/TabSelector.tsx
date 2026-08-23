export interface TabSelectorOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface TabSelectorProps {
  value: string;
  options: TabSelectorOption[];
  onChange: (value: string) => void;
  ariaLabel: string;
  className?: string;
}

/** Accessible single-choice tab row with GymHajime's orange active indicator. */
export default function TabSelector({
  value,
  options,
  onChange,
  ariaLabel,
  className = '',
}: TabSelectorProps) {
  return (
    <div
      className={`flex gap-4 border-b border-orange-100 sm:gap-8 ${className}`}
      role="tablist"
      aria-label={ariaLabel}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={selected}
            disabled={option.disabled}
            onClick={() => onChange(option.value)}
            className={`cursor-pointer border-b-2 px-1 pb-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${selected ? 'border-orange-500 text-orange-600' : 'border-transparent text-neutral-500 hover:text-neutral-900'}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
