'use client';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function Header() {
  const t = useTranslations('header');

  return (
    <header className="bg-[var(--color-palco)] px-6 py-4 shadow-md">
      <div className="max-w-screen-xl mx-auto flex items-center gap-4">
        <Image
          src="/palco-logo.png"
          alt="Palco logo"
          width={120}
          height={120}
          className="h-20 w-auto rounded-md shadow-lg bg-[var(--color-palco-light)]"
          priority
        />
        <div className="text-[var(--color-palco-soft)]">
          <h1 className="text-2xl font-bold leading-tight">FindPalco</h1>
          <p className="text-sm font-medium text-[var(--color-palco-accent)]">
            {t('header-tagline')}
          </p>
        </div>
      </div>
    </header>
  );
}
