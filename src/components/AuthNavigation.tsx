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
import DropdownMenu from './DropdownMenu';
import LanguageSelector from './LanguageSelector';
import UserInitials from './UserInitials';

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
      <div className="flex items-center gap-1 text-[var(--color-brand-soft)] sm:gap-2">
        <nav className="flex gap-1" aria-label="Account">
          <NavLink href={`/${locale}/login`} text={t('login')} />
          <NavLink href={`/${locale}/signup`} text={t('signup')} />
        </nav>
        <LanguageSelector />
      </div>
    );
  }

  return (
    <div className="flex min-w-0 items-center gap-1 text-[var(--color-brand-soft)] sm:gap-2">
      <div ref={navigationRef} className="relative flex items-center gap-1">
        <UserInitials name={userName} className="md:hidden" />
        <span className="hidden max-w-48 truncate text-sm font-bold md:block">{userName}</span>
        <ChevronButton
          isOpen={isOpen}
          onClick={() => setIsOpen((open) => !open)}
          label={t('account-menu')}
        />

        <DropdownMenu
          isOpen={isOpen}
          options={[
            {
              id: 'logout',
              label: t('logout'),
              onClick: () => {
                setIsOpen(false);
                setShowLogoutModal(true);
              },
            },
          ]}
        />
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
      <LanguageSelector />
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
