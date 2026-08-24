'use client';
import { useTranslations } from 'next-intl';
import AuthNavigation from './AuthNavigation';
import BrandLogo from './BrandLogo';
import HajimeInfo from './HajimeInfo';

export default function Header() {
  const t = useTranslations('header');

  return (
    <header className="shrink-0 border-b border-orange-600/40 bg-[var(--color-brand)] px-5 py-2 shadow-sm">
      <div className="mx-auto flex h-12 max-w-[1500px] items-center justify-between gap-6">
        <div className="flex min-w-0 items-center gap-3">
          <BrandLogo
            width={48}
            height={48}
            className="h-11 w-11 rounded-lg bg-[var(--color-brand-light)] shadow-sm ring-1 ring-white/30"
            priority
          />
          <div className="min-w-0 cursor-default leading-tight">
            <h1 className="truncate text-lg font-black tracking-tight text-white">GymHajime</h1>
            <p className="truncate text-xs font-semibold text-[var(--color-brand-dark)]">
              {t('header-tagline')}
            </p>
          </div>
          <span className="ml-1 h-7 w-px bg-black/10" aria-hidden />
          <HajimeInfo iconOnly />
        </div>

        <div className="shrink-0">
          <AuthNavigation />
        </div>
      </div>
    </header>
  );
}
