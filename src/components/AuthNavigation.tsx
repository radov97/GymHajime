'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import supabase from '@/lib/supabaseClient';
import NavLink from './NavLink';
import ChevronButton from './ChevronButton';
import ModalPopup from './ModalPopup';
import { ButtonRank, ButtonType } from '@/lib/enums';

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
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigationRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const t = useTranslations('header');

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    await onLogout?.();
    setIsLoggingOut(false);
    setShowLogoutModal(false);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!navigationRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen]);

  if (!userName) {
    return (
      <nav className="flex gap-4 text-[var(--color-brand-soft)]" aria-label="Account">
        <NavLink href={`/${locale}/login`} text={t('login')} />
        <NavLink href={`/${locale}/signup`} text={t('signup')} />
      </nav>
    );
  }

  return (
    <div
      ref={navigationRef}
      className="relative flex items-center gap-1 text-[var(--color-brand-soft)]"
    >
      <span className="font-semibold">{userName}</span>
      <ChevronButton
        isOpen={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        label={t('account-menu')}
      />

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full z-20 mt-2 min-w-36 rounded-md bg-white p-1 text-gray-900 shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setIsOpen(false);
              setShowLogoutModal(true);
            }}
            className="w-full rounded px-3 py-2 text-left hover:bg-gray-100 cursor-pointer"
          >
            {t('logout')}
          </button>
        </div>
      )}
      <ModalPopup
        isOpen={showLogoutModal}
        title={t('logout-title')}
        subtitle={t('logout-message')}
        onClose={() => setShowLogoutModal(false)}
        buttons={[
          {
            text: t('logout-cancel'),
            rank: ButtonRank.Secondary,
            type: ButtonType.Button,
            onClick: () => setShowLogoutModal(false),
            disabled: isLoggingOut,
          },
          {
            text: t('logout-confirm'),
            rank: ButtonRank.Danger,
            type: ButtonType.Button,
            onClick: confirmLogout,
            loading: isLoggingOut,
          },
        ]}
      />
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
