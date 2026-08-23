import { Search } from 'lucide-react';
import { formatCategory } from '@/lib/exercises';
import TextInput from '@/components/TextInput';
import ExerciseCategorySelector from './ExerciseCategorySelector';

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
        className="max-w-2xl"
      />
      <ExerciseCategorySelector
        value={category}
        onChange={onCategoryChange}
        categories={categories}
        getCategoryLabel={getCategoryLabel}
        allLabel={labels.all}
        ariaLabel={labels.category}
      />
    </div>
  );
}
