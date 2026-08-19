'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Loader } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('auth-confirmed');

  useEffect(() => {
    // Supabase will automatically parse the token in the hash and store session

    // Clean up the URL
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }

    // Optionally wait a sec before redirecting
    const timeout = setTimeout(() => {
      router.push(`/${locale}/dashboard`);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [locale, router]);

  return (
    <div className="h-screen flex flex-col items-center justify-center text-center space-y-6">
      <Loader className="animate-spin w-24 h-24 text-[var(--color-brand)]" />
      <p className="mb-4 text-sm text-gray-600 text-center cursor-default">{t('signing-you-in')}</p>
    </div>
  );
}
