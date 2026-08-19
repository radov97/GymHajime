import { describe, expect, it } from 'vitest';
import { metadata } from './layout';

describe('root layout metadata', () => {
  it('describes the GymHajime application and icons', () => {
    expect(metadata.title).toBe('GymHajime');
    expect(metadata.description).toMatch(/workout planning/i);
    expect(metadata.manifest).toBe('/site.webmanifest');
  });
});
