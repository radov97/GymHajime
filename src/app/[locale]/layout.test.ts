import { describe, expect, it, vi } from 'vitest';

vi.mock('@/components/ResponsiveHeader', () => ({ default: () => null }));
import { generateStaticParams, metadata } from './layout';

describe('localized layout', () => {
  it('pre-renders every supported locale', () => {
    expect(generateStaticParams()).toEqual([
      { locale: 'en' },
      { locale: 'it' },
      { locale: 'es' },
      { locale: 'ro' },
      { locale: 'fr' },
      { locale: 'de' },
      { locale: 'tl' },
    ]);
  });

  it('uses consistent product metadata', () => {
    expect(metadata.title).toBe('GymHajime');
    expect(metadata.description).toMatch(/fitness tracking/i);
  });
});
