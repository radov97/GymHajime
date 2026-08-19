import { describe, expect, it } from 'vitest';
import { defaultLocale, isLocale, locales } from './i18n';

describe('locale configuration', () => {
  it('has a supported default locale', () => {
    expect(defaultLocale).toBe('en');
    expect(locales).toContain(defaultLocale);
  });

  it('recognizes supported and unsupported locale values', () => {
    expect(isLocale('ro')).toBe(true);
    expect(isLocale('ja')).toBe(false);
  });
});
