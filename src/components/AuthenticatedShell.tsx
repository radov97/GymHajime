'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { Loader } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import supabase from '@/lib/supabaseClient';
import Sidebar from './Sidebar';

export interface AuthenticatedShellProps {
  children: ReactNode;
}

export default function AuthenticatedShell({ children }: AuthenticatedShellProps) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const locale = useLocale();
  const router = useRouter();

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user === null) router.replace(`/${locale}/login`);
  }, [locale, router, user]);

  if (!user) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center" role="status">
        <Loader className="h-10 w-10 animate-spin text-[var(--color-brand)]" aria-hidden />
        <span className="sr-only">Checking session...</span>
      </main>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-7rem)]">
      <Sidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
