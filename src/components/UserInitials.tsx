export interface UserInitialsProps {
  name: string;
  className?: string;
}

/** Converts a person's display name into a compact maximum of three initials. */
export function getUserInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return '?';
  return words
    .slice(0, 3)
    .map((word) => Array.from(word)[0])
    .join('')
    .toLocaleUpperCase();
}

/** Compact account identity for space-constrained navigation. */
export default function UserInitials({ name, className = '' }: UserInitialsProps) {
  return (
    <span
      title={name}
      aria-label={name}
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand-soft)] text-xs font-black tracking-wide text-[var(--color-brand-ink)] shadow-sm ring-2 ring-white/40 ${className}`}
    >
      {getUserInitials(name)}
    </span>
  );
}
