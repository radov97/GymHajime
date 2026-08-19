import { describe, expect, it, vi } from 'vitest';

const redirect = vi.hoisted(() => vi.fn());
vi.mock('next/navigation', () => ({ redirect }));

import Home from './page';

describe('root page', () => {
  it('redirects to the default English locale', () => {
    Home();
    expect(redirect).toHaveBeenCalledWith('/en');
  });
});
