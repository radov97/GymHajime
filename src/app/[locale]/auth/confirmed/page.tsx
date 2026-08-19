'use client';

import Button from '@/components/Button';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { ButtonRank } from '@/lib/enums';
import { useEffect } from 'react';

export default function LocaleConfirmedPage() {
  const t = useTranslations('auth-confirmed');
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(`/${locale}/login`);
    }, 10000);

    return () => clearTimeout(timer);
  }, [router, locale]);

  const handleContinue = () => {
    router.push(`/${locale}/login`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold text-[var(--color-brand)] mb-4">
          {t('email-confirmed')}
        </h1>
        <p className="text-gray-700 text-lg mb-6">{t('welcome-message')}</p>
        <Button text={t('continue')} onClick={handleContinue} rank={ButtonRank.Link} />
      </div>
    </main>
  );
}
