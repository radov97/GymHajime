'use client';

import Link from 'next/link';

export default function LinkPalco({ href, text }) {
  return (
    <Link
      href={href}
      className="text-[var(--color-palco-light)] text-sm font-semibold px-3 py-1 rounded-md transition-all duration-200 ease-in-out hover:text-[17px] hover:bg-[var(--color-palco-accent)] hover:text-[var(--color-palco-black)]"
    >
      {text}
    </Link>
  );
}
