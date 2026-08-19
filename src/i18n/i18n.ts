export const languageOptions = {
  en: { countryCode: 'GB', label: 'English' },
  it: { countryCode: 'IT', label: 'Italiano' },
  es: { countryCode: 'ES', label: 'Español' },
  ro: { countryCode: 'RO', label: 'Română' },
  fr: { countryCode: 'FR', label: 'Français' },
  de: { countryCode: 'DE', label: 'Deutsch' },
  tl: { countryCode: 'PH', label: 'Tagalog' },
} as const;

export type Locale = keyof typeof languageOptions;
export const locales = Object.keys(languageOptions) as Locale[];

export const defaultLocale: Locale = 'en';

export function isLocale(value: string): value is Locale {
  return Object.prototype.hasOwnProperty.call(languageOptions, value);
}
