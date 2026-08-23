import type { Exercise } from '@/lib/exercises';

/** Reusable sample exercise for stories and other development-only previews. */
export const exerciseFixture: Exercise = {
  id: '8d3dc265-52a7-49ad-aabc-65fa947c9bbb',
  name: 'Barbell Bench Press',
  category: 'chest',
  description: 'Lie on a flat bench and press the bar upward until your arms are extended.',
  images: [1, 2, 3].map((number) => ({
    image_path: `8d3dc265-52a7-49ad-aabc-65fa947c9bbb/${number}.webp`,
    sort_order: number,
    url: '/gymhajime-logo.png',
  })),
};
