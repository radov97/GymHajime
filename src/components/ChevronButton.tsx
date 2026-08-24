import { ChevronDown } from 'lucide-react';
import IconButton from './IconButton';

export interface ChevronButtonProps {
  isOpen: boolean;
  onClick: () => void;
  label: string;
}

export default function ChevronButton({ isOpen, onClick, label }: ChevronButtonProps) {
  return (
    <IconButton
      icon={
        <ChevronDown
          aria-hidden
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      }
      label={label}
      iconOnly
      variant="ghost"
      className="!rounded-md !p-2 hover:!bg-black/10"
      aria-expanded={isOpen}
      aria-haspopup="menu"
      onClick={onClick}
    />
  );
}
