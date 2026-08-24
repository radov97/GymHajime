'use client';

import Link from 'next/link';
import { useState, type ComponentType } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useMediaQuery } from 'react-responsive';
import { BREAKPOINTS } from '@/lib/breakpoints';
import IconButton from './IconButton';
import {
  CalendarDays,
  ChartNoAxesCombined,
  Dumbbell,
  History,
  CalendarClock,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
} from 'lucide-react';

interface SidebarItem {
  id: string;
  path: string;
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
}

const primaryItems: SidebarItem[] = [
  { id: 'daily-training', path: 'daily-training', icon: CalendarClock },
  { id: 'schedule', path: 'schedule', icon: CalendarDays },
  { id: 'exercises', path: 'exercises', icon: Dumbbell },
  { id: 'discover', path: 'discover', icon: Search },
  { id: 'history', path: 'history', icon: History },
  { id: 'progress', path: 'progress', icon: ChartNoAxesCombined },
  { id: 'settings', path: 'settings', icon: Settings },
];

export interface SidebarProps {
  initiallyCollapsed?: boolean;
}

export default function Sidebar({ initiallyCollapsed = false }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(initiallyCollapsed);
  const isCompactViewport = useMediaQuery({ maxWidth: BREAKPOINTS.mobileMax });
  const showCollapsed = isCompactViewport || isCollapsed;
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('sidebar');

  const renderItem = ({ id, path, icon: Icon }: SidebarItem) => {
    const href = `/${locale}/${path}`;
    const isActive = pathname === href || pathname.startsWith(`${href}/`);
    const label = t(id);

    return (
      <Link
        key={id}
        href={href}
        title={showCollapsed ? label : undefined}
        aria-label={showCollapsed ? label : undefined}
        aria-current={isActive ? 'page' : undefined}
        className={`flex h-[42px] items-center gap-3 rounded-xl border px-3 text-sm font-bold transition ${
          isActive
            ? 'border-[var(--color-brand)] bg-[var(--color-brand)] text-white shadow-sm'
            : 'border-transparent text-gray-700 hover:border-orange-200 hover:bg-orange-100 hover:text-[var(--color-brand-ink)]'
        }`}
      >
        <Icon className="h-5 w-5 shrink-0" aria-hidden />
        {!showCollapsed && <span className="whitespace-nowrap font-medium">{label}</span>}
      </Link>
    );
  };

  return (
    <aside
      aria-label={t('navigation')}
      className={`flex h-full shrink-0 flex-col overflow-hidden border-r border-orange-200 bg-white/80 p-3 shadow-sm backdrop-blur transition-[width] duration-200 ${
        showCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="mb-5 flex items-center justify-between gap-2 px-2">
        {!showCollapsed && (
          <span className="font-black tracking-[0.16em] text-[var(--color-brand-ink)]">
            GYMHAJIME
          </span>
        )}
        {!isCompactViewport && (
          <IconButton
            icon={
              isCollapsed ? (
                <PanelLeftOpen className="h-5 w-5" />
              ) : (
                <PanelLeftClose className="h-5 w-5" />
              )
            }
            label={isCollapsed ? t('expand') : t('collapse')}
            iconOnly
            variant="ghost"
            onClick={() => setIsCollapsed((collapsed) => !collapsed)}
            aria-expanded={!isCollapsed}
            className="ml-auto !rounded-md !p-2 text-gray-600 hover:!bg-orange-100 hover:!text-[var(--color-brand)]"
          />
        )}
      </div>

      <nav className="flex flex-col gap-1" aria-label={t('primary-navigation')}>
        {primaryItems.map(renderItem)}
      </nav>
    </aside>
  );
}
