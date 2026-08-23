import { ChevronDown, Search, X } from 'lucide-react';
import { formatCategory } from '@/lib/exercises';

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
      <div className="relative min-w-0 max-w-2xl">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400"
          aria-hidden
        />
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={labels.search}
          aria-label={labels.search}
          className="w-full rounded-xl border border-orange-100 bg-white py-2.5 pl-10 pr-10 text-sm text-neutral-900 shadow-sm outline-none transition placeholder:text-ellipsis focus:border-orange-400 focus:ring-2 focus:ring-orange-100 md:rounded-2xl md:py-3.5 md:pl-12 md:pr-12 md:text-base"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            aria-label={labels.clear}
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-neutral-400 hover:text-neutral-900"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      <div className="relative min-w-0 md:hidden">
        <select
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
          aria-label={labels.category}
          className="w-full cursor-pointer appearance-none truncate rounded-xl border border-orange-100 bg-white px-3 py-2.5 pr-9 text-sm font-semibold text-neutral-700 shadow-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
        >
          <option value="">{labels.all}</option>
          {categories.map((value) => (
            <option key={value} value={value}>
              {getCategoryLabel(value)}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
          aria-hidden
        />
      </div>
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
