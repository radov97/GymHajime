import type { ReactNode } from 'react';

export interface DropdownMenuOption {
  id: string;
  label: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

export interface DropdownMenuProps {
  isOpen: boolean;
  options: DropdownMenuOption[];
}

export default function DropdownMenu({ isOpen, options }: DropdownMenuProps) {
  if (!isOpen) return null;

  return (
    <div
      role="menu"
      className="absolute right-0 top-full z-20 mt-2 min-w-36 rounded-md bg-white p-1 text-gray-900 shadow-lg"
    >
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          role="menuitem"
          disabled={option.disabled}
          onClick={option.onClick}
          className="w-full rounded px-3 py-2 text-left hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
