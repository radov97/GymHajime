import { Search } from 'lucide-react';
import { formatCategory } from '@/lib/exercises';
import SelectDropdown from '@/components/SelectDropdown';
import TextInput from '@/components/TextInput';

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  categories: string[];
  category: string;
  onCategoryChange: (value: string) => void;
  getCategoryLabel?: (category: string) => string;
  labels: { search: string; clear: string; all: string; category: string };
}

export default function ExerciseFilters({
  search,
  onSearchChange,
  categories,
  category,
  onCategoryChange,
  getCategoryLabel = formatCategory,
  labels,
}: Props) {
  return (
    <div className="grid grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-2 md:block md:space-y-5">
      <TextInput
        type="search"
        value={search}
        onChange={onSearchChange}
        onClear={() => onSearchChange('')}
        clearLabel={labels.clear}
        placeholder={labels.search}
        ariaLabel={labels.search}
        leadingIcon={<Search className="h-5 w-5" />}
        className="max-w-2xl md:[&_input]:rounded-2xl md:[&_input]:py-3.5 md:[&_input]:pl-12 md:[&_input]:pr-12 md:[&_input]:text-base"
      />
      <SelectDropdown
        value={category}
        onChange={onCategoryChange}
        ariaLabel={labels.category}
        className="md:hidden"
        options={[
          { value: '', label: labels.all },
          ...categories.map((value) => ({ value, label: getCategoryLabel(value) })),
        ]}
      />
      <div className="hidden flex-wrap gap-2 md:flex" aria-label={labels.category}>
        {['', ...categories].map((value) => {
          const selected = category === value;
          return (
            <button
              key={value || 'all'}
              type="button"
              aria-pressed={selected}
              onClick={() => onCategoryChange(value)}
              className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold transition ${selected ? 'border-orange-500 bg-orange-500 text-white shadow-sm' : 'border-orange-100 bg-white text-neutral-700 hover:border-orange-300 hover:text-orange-600'}`}
            >
              {value ? getCategoryLabel(value) : labels.all}
            </button>
          );
        })}
      </div>
    </div>
  );
}
