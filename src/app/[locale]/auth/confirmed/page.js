'use client';

import ButtonPalco from '@/components/ButtonPalco';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ButtonRank } from '@/lib/enums';
import { useEffect } from 'react';

export default function LocaleConfirmedPage() {
  const t = useTranslations('auth-confirmed');
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/'); // or '/dashboard' when ready
    }, 4000);

    return () => clearTimeout(timer);
  }, [router]);
  const handleContinue = () => {
    router.push('/');
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold text-[var(--color-palco)] mb-4">
          {t('email-confirmed')}
        </h1>
        <p className="text-gray-700 text-lg mb-6">{t('welcome-message')}</p>
        <ButtonPalco text={t('continue')} onClick={handleContinue} rank={ButtonRank.Link} />
      </div>
    </main>
  );
}
