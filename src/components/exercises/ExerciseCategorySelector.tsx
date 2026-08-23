import OptionPills from '@/components/OptionPills';
import SelectDropdown from '@/components/SelectDropdown';

interface Props {
  value: string;
  categories: string[];
  onChange: (value: string) => void;
  getCategoryLabel: (category: string) => string;
  allLabel: string;
  ariaLabel: string;
  className?: string;
}

/** Full-width mobile dropdown paired with desktop category pills. */
export default function ExerciseCategorySelector({
  value,
  categories,
  onChange,
  getCategoryLabel,
  allLabel,
  ariaLabel,
  className = '',
}: Props) {
  const options = [
    { value: '', label: allLabel },
    ...categories.map((category) => ({ value: category, label: getCategoryLabel(category) })),
  ];
  return (
    <div className={`w-full ${className}`}>
      <SelectDropdown
        value={value}
        onChange={onChange}
        ariaLabel={ariaLabel}
        className="w-full md:hidden"
        options={options}
      />
      <OptionPills
        value={value}
        onChange={onChange}
        ariaLabel={ariaLabel}
        className="hidden md:flex"
        options={options}
      />
    </div>
  );
}
