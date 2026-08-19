export const locales = ['en', 'it', 'es', 'ro', 'fr', 'de', 'tl'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export function isLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}
