'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type ComponentType } from 'react';
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
  LayoutDashboard,
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
  { id: 'dashboard', path: 'dashboard', icon: LayoutDashboard },
  { id: 'schedule', path: 'schedule', icon: CalendarDays },
  { id: 'exercises', path: 'exercises', icon: Dumbbell },
  { id: 'discover', path: 'discover', icon: Search },
  { id: 'history', path: 'history', icon: History },
  { id: 'progress', path: 'progress', icon: ChartNoAxesCombined },
];

const settingsItem: SidebarItem = { id: 'settings', path: 'settings', icon: Settings };

export interface SidebarProps {
  initiallyCollapsed?: boolean;
}

export default function Sidebar({ initiallyCollapsed = false }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(initiallyCollapsed);
  const [isPinnedToViewport, setIsPinnedToViewport] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const isCompactViewport = useMediaQuery({ maxWidth: BREAKPOINTS.mobileMax });
  const showCollapsed = isCompactViewport || isCollapsed;
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('sidebar');

  // The sidebar begins below the site header. Once scrolling makes its sticky top reach the top of
  // the viewport, it expands from the shell-height calculation to the full dynamic viewport height.
  useEffect(() => {
    const updatePinnedState = () => {
      const sidebar = sidebarRef.current;
      setIsPinnedToViewport(
        Boolean(sidebar && window.scrollY > 0 && sidebar.getBoundingClientRect().top <= 0)
      );
    };
    updatePinnedState();
    window.addEventListener('scroll', updatePinnedState, { passive: true });
    return () => window.removeEventListener('scroll', updatePinnedState);
  }, []);

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
        className={`flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
          isActive
            ? 'bg-[var(--color-brand)] text-white shadow-sm'
            : 'text-gray-700 hover:bg-orange-100 hover:text-[var(--color-brand-ink)]'
        }`}
      >
        <Icon className="h-5 w-5 shrink-0" aria-hidden />
        {!showCollapsed && <span className="whitespace-nowrap font-medium">{label}</span>}
      </Link>
    );
  };

  return (
    <aside
      ref={sidebarRef}
      aria-label={t('navigation')}
      className={`sticky top-0 flex shrink-0 self-start flex-col overflow-y-auto border-r border-orange-200 bg-white/80 p-3 shadow-sm backdrop-blur transition-[width,height] duration-200 ${isPinnedToViewport ? 'h-dvh' : 'h-[calc(100dvh-7rem)]'} ${
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

      <nav className="flex flex-1 flex-col gap-1" aria-label={t('primary-navigation')}>
        {primaryItems.map(renderItem)}
      </nav>

      <div className="mt-6 border-t border-orange-200 pt-3">{renderItem(settingsItem)}</div>
    </aside>
  );
}
