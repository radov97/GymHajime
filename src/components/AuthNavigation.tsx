'use client';

import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import supabase from '@/lib/supabaseClient';
import NavLink from './NavLink';

export interface AuthNavigationViewProps {
  userName?: string | null;
  onLogout?: () => void | Promise<void>;
  initiallyOpen?: boolean;
}

export function AuthNavigationView({
  userName,
  onLogout,
  initiallyOpen = false,
}: AuthNavigationViewProps) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const locale = useLocale();
  const t = useTranslations('header');

  if (!userName) {
    return (
      <nav className="flex gap-4 text-[var(--color-brand-soft)]" aria-label="Account">
        <NavLink href={`/${locale}/login`} text={t('login')} />
        <NavLink href={`/${locale}/signup`} text={t('signup')} />
      </nav>
    );
  }

  return (
    <div className="relative text-[var(--color-brand-soft)]">
      <button
        type="button"
        className="flex items-center gap-2 rounded-md px-3 py-2 font-semibold hover:bg-black/10 cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span>{t('welcome', { name: userName })}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-2 min-w-36 rounded-md bg-white p-1 text-gray-900 shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            onClick={onLogout}
            className="w-full rounded px-3 py-2 text-left hover:bg-gray-100 cursor-pointer"
          >
            {t('logout')}
          </button>
        </div>
      )}
    </div>
  );
}

export default function AuthNavigation() {
  const [user, setUser] = useState<User | null>(null);
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('header');

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout failed:', error.message);
      return;
    }

    setUser(null);
    router.push(`/${locale}/login`);
    router.refresh();
  };

  const name = user ? user.user_metadata.full_name || user.email || t('user') : null;

  return <AuthNavigationView userName={name} onLogout={handleLogout} />;
}
