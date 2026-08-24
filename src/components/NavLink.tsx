'use client';

import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

export interface NavLinkProps {
  href: ComponentProps<typeof Link>['href'];
  text: ReactNode;
}

export default function NavLink({ href, text }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex h-10 items-center rounded-lg px-2.5 text-sm font-bold text-[var(--color-brand-light)] transition-colors hover:bg-black/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:px-3"
    >
      {text}
    </Link>
  );
}
