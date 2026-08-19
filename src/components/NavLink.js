'use client';

import Link from 'next/link';

export default function NavLink({ href, text }) {
  return (
    <Link
      href={href}
      className="text-[var(--color-brand-light)] text-sm font-semibold px-3 py-1 rounded-md transition-all duration-200 ease-in-out hover:text-[17px] hover:bg-[var(--color-brand-accent)] hover:text-[var(--color-brand-ink)]"
    >
      {text}
    </Link>
  );
}
