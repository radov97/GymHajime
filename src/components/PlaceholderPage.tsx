'use client';

import { useTranslations } from 'next-intl';

export interface PlaceholderPageProps {
  titleKey: string;
}

export default function PlaceholderPage({ titleKey }: PlaceholderPageProps) {
  const t = useTranslations('sidebar');

  return (
    <main className="mx-auto max-w-screen-xl p-6">
      <h1 className="text-3xl font-bold text-[var(--color-brand-ink)]">{t(titleKey)}</h1>
    </main>
  );
}
