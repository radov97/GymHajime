'use client';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

export default function Header() {
  const t = useTranslations('header');
  const locale = useLocale();

  return (
    <header className="bg-[var(--color-palco)] px-6 py-4 shadow-md">
      <div className="max-w-screen-xl mx-auto flex items-center gap-6 justify-between">
        <div className="flex items-center gap-4">
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

        <div className="flex gap-4 text-[var(--color-palco-soft)]">
          <Link
            href={`/${locale}/login`}
            className="text-[var(--color-palco-light)] text-sm font-semibold px-3 py-1 rounded-md transition-all duration-200 ease-in-out hover:text-[17px] hover:bg-[var(--color-palco-accent)] hover:text-[var(--color-palco-black)]"
          >
            {t('login')}
          </Link>

          <Link
            href={`/${locale}/signup`}
            className="text-[var(--color-palco-light)] text-sm font-semibold px-3 py-1 rounded-md transition-all duration-200 ease-in-out hover:text-[17px] hover:bg-[var(--color-palco-accent)] hover:text-[var(--color-palco-black)]"
          >
            {t('signup')}
          </Link>
        </div>
      </div>
    </header>
  );
}
