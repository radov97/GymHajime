import { ChevronDown } from 'lucide-react';

export interface ChevronButtonProps {
  isOpen: boolean;
  onClick: () => void;
  label: string;
}

export default function ChevronButton({ isOpen, onClick, label }: ChevronButtonProps) {
  return (
    <button
      type="button"
      className="rounded-md p-2 hover:bg-black/10 cursor-pointer"
      aria-label={label}
      aria-expanded={isOpen}
      aria-haspopup="menu"
      onClick={onClick}
    >
      <ChevronDown
        aria-hidden="true"
        className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
      />
    </button>
  );
}
