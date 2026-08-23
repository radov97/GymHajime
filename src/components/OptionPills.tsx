export interface OptionPill {
  value: string;
  label: string;
  disabled?: boolean;
}

interface OptionPillsProps {
  value: string;
  options: OptionPill[];
  onChange: (value: string) => void;
  ariaLabel: string;
  className?: string;
}

/** Single-choice pill group used for compact desktop filters and segmented options. */
export default function OptionPills({
  value,
  options,
  onChange,
  ariaLabel,
  className = '',
}: OptionPillsProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`} aria-label={ariaLabel} role="group">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            disabled={option.disabled}
            onClick={() => onChange(option.value)}
            className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${selected ? 'border-orange-500 bg-orange-500 text-white shadow-sm' : 'border-orange-100 bg-white text-neutral-700 hover:border-orange-300 hover:text-orange-600'}`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
