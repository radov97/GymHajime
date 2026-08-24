'use client';

import { useEffect, useRef, useState } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { ChevronDown } from 'lucide-react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { languageOptions, locales, type Locale } from '@/i18n/i18n';
import DropdownMenu from './DropdownMenu';
import IconButton from './IconButton';

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const currentLanguage = languageOptions[locale] ?? languageOptions.en;

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!selectorRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    document.addEventListener('pointerdown', closeOnOutsideClick);
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick);
  }, [isOpen]);

  const selectLanguage = (nextLocale: Locale) => {
    // Next Intl reads this cookie on future visits; the localized URL remains
    // the immediate source of truth and continues to work when shared.
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;

    const segments = pathname.split('/');
    if (locales.includes(segments[1] as Locale)) segments[1] = nextLocale;
    else segments.splice(1, 0, nextLocale);

    setIsOpen(false);
    router.push(segments.join('/') || `/${nextLocale}`);
    router.refresh();
  };

  return (
    <div ref={selectorRef} className="relative">
      <IconButton
        icon={
          <>
            <ReactCountryFlag
              countryCode={currentLanguage.countryCode}
              svg
              aria-label={currentLanguage.label}
              className="h-4 w-6 rounded-sm object-cover"
            />
            <ChevronDown
              aria-hidden
              className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </>
        }
        label={`Select language. Current language: ${currentLanguage.label}`}
        iconOnly
        variant="ghost"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((open) => !open)}
        className="!rounded-md !p-2 hover:!bg-black/10 [&>span]:gap-1"
      />

      <DropdownMenu
        isOpen={isOpen}
        options={locales.map((optionLocale) => ({
          id: optionLocale,
          label: (
            <span className="flex items-center gap-2">
              <ReactCountryFlag
                countryCode={languageOptions[optionLocale].countryCode}
                svg
                aria-hidden="true"
                className="h-4 w-6 rounded-sm object-cover"
              />
              {languageOptions[optionLocale].label}
            </span>
          ),
          onClick: () => selectLanguage(optionLocale),
          disabled: optionLocale === locale,
        }))}
      />
    </div>
  );
}
