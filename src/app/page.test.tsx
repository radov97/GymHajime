import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ redirect: vi.fn(), savedLocale: undefined as string | undefined }));
vi.mock('next/navigation', () => ({ redirect: mocks.redirect }));
vi.mock('next/headers', () => ({
  cookies: async () => ({
    get: (name: string) => (name === 'NEXT_LOCALE' && mocks.savedLocale
      ? { value: mocks.savedLocale }
      : undefined),
  }),
}));

import Home from './page';

describe('root page', () => {
  beforeEach(() => {
    mocks.savedLocale = undefined;
  });

  it('redirects to the saved locale', async () => {
    mocks.savedLocale = 'ro';
    await Home();
    expect(mocks.redirect).toHaveBeenCalledWith('/ro');
  });

  it('defaults to English when no preference exists', async () => {
    await Home();
    expect(mocks.redirect).toHaveBeenCalledWith('/en');
  });

  it('defaults to English when the cookie has an unsupported value', async () => {
    mocks.savedLocale = 'invalid';
    await Home();
    expect(mocks.redirect).toHaveBeenCalledWith('/en');
  });
});
