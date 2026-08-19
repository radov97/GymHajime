'use client';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import AuthNavigation from './AuthNavigation';

export default function Header() {
  const t = useTranslations('header');

  return (
    <header className="bg-[var(--color-brand)] px-6 py-4 shadow-md">
      <div className="max-w-screen-xl mx-auto flex items-center gap-6 justify-between">
        <div className="flex items-center gap-4">
          <Image
            src="/gymhajime-logo.png"
            alt="GymHajime logo"
            width={120}
            height={120}
            className="h-20 w-auto rounded-md shadow-lg bg-[var(--color-brand-light)]"
            priority
          />
          <div className="text-[var(--color-brand-soft)]">
            <h1 className="text-2xl font-bold leading-tight cursor-default">GymHajime</h1>
            <p className="text-sm font-semibold text-[var(--color-brand-dark)] cursor-default">
              {t('header-tagline')}
            </p>
          </div>
        </div>

        <AuthNavigation />
      </div>
    </header>
  );
}
