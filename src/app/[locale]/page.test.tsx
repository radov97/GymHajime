import { beforeEach, describe, expect, it, vi } from 'vitest';

const redirect = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({ redirect }));

import Home from './page';

describe('localized home page', () => {
  beforeEach(() => redirect.mockClear());

  it.each(['en', 'it', 'es', 'ro', 'fr', 'de', 'tl'])(
    'redirects /%s to its localized login page',
    async (locale) => {
      await Home({ params: Promise.resolve({ locale }) });

      expect(redirect).toHaveBeenCalledWith(`/${locale}/login`);
    }
  );
});
