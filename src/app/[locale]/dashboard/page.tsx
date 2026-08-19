'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabaseClient';

export default function DashboardPage() {
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const locale = useLocale();
  const router = useRouter();

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace(`/${locale}/login`);
        return;
      }

      setIsCheckingSession(false);
    });
  }, [locale, router]);

  if (isCheckingSession) return null;

  return (
    <main className="mx-auto max-w-screen-xl p-6">
      <h1 className="text-3xl font-bold text-[var(--color-brand-ink)]">This is the dashboard</h1>
    </main>
  );
}
