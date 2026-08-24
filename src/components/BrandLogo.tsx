'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import supabase from '@/lib/supabaseClient';

export interface BrandLogoProps {
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

export interface BrandLogoViewProps extends BrandLogoProps {
  isAuthenticated: boolean;
  isCurrentDailyTraining?: boolean;
  locale: string;
}

export function BrandLogoView({
  width,
  height,
  className,
  priority = false,
  isAuthenticated,
  isCurrentDailyTraining = false,
  locale,
}: BrandLogoViewProps) {
  const logo = (
    <Image
      src="/gymhajime-logo.png"
      alt="GymHajime logo"
      width={width}
      height={height}
      className={`${className ?? ''} ${
        isAuthenticated && !isCurrentDailyTraining
          ? 'transition-all duration-200 ease-out group-hover:-translate-y-0.5 group-hover:scale-105 group-hover:brightness-110 group-hover:shadow-xl'
          : ''
      }`}
      priority={priority}
    />
  );

  if (!isAuthenticated || isCurrentDailyTraining) return logo;

  return (
    <Link
      href={`/${locale}/daily-training`}
      aria-label="Go to Daily Training"
      className="group inline-block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-brand)]"
    >
      {logo}
    </Link>
  );
}

export default function BrandLogo({ width, height, className, priority = false }: BrandLogoProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const locale = useLocale();
  const pathname = usePathname();

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => setIsAuthenticated(Boolean(data.user)));

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session?.user));
    });

    return () => data.subscription.unsubscribe();
  }, []);

  return (
    <BrandLogoView
      width={width}
      height={height}
      className={className}
      priority={priority}
      isAuthenticated={isAuthenticated}
      isCurrentDailyTraining={pathname === `/${locale}/daily-training`}
      locale={locale}
    />
  );
}
