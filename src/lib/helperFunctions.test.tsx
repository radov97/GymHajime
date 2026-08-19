import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { isNotEmptyString, isValidEmail, useValidatedPassword } from './helperFunctions';
import { NextIntlClientProvider } from 'next-intl';
import type { ReactNode } from 'react';
import en from '../../messages/en.json';

function wrapper({ children }: { children: ReactNode }) {
  return (
    <NextIntlClientProvider locale="en" messages={en}>
      {children}
    </NextIntlClientProvider>
  );
}

describe('validation helpers', () => {
  it.each([
    ['athlete@example.com', true],
    [' athlete@example.com ', true],
    ['missing-at-sign.example.com', false],
    ['athlete@', false],
  ])('validates email %s', (email, expected) => {
    expect(isValidEmail(email)).toBe(expected);
  });

  it('rejects blank strings', () => {
    expect(isNotEmptyString('   ')).toBe(false);
    expect(isNotEmptyString(' Squat day ')).toBe(true);
  });

  it('returns localized password requirements', () => {
    const { result } = renderHook(() => useValidatedPassword(), { wrapper });
    expect(result.current('short')).toEqual([
      'Password must be at least 8 characters.',
      'Password must include at least one uppercase letter.',
      'Password must include at least one special character.',
    ]);
    expect(result.current('StrongPass1!')).toEqual([]);
  });
});
