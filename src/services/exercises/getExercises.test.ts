import { describe, expect, it } from 'vitest';
import { detectCategoryIntent, meaningfulSearchTerms } from './getExercises';

describe('meaningfulSearchTerms', () => {
  it('removes English exercise-search filler words', () => {
    expect(meaningfulSearchTerms('exercises for smith machine', 'en')).toEqual([
      'smith',
      'machine',
    ]);
  });

  it('normalizes punctuation, casing, and duplicate terms', () => {
    expect(meaningfulSearchTerms('BENCH, press bench!', 'en')).toEqual(['bench', 'press']);
  });

  it('uses locale-specific filler words', () => {
    expect(meaningfulSearchTerms('exerciții pentru piept', 'ro')).toEqual(['piept']);
    expect(meaningfulSearchTerms('mga ehersisyo para sa dibdib', 'tl')).toEqual(['dibdib']);
  });

  it('retains tokens when the query contains only filler words', () => {
    expect(meaningfulSearchTerms('exercises', 'en')).toEqual(['exercises']);
  });
});

describe('detectCategoryIntent', () => {
  it('finds a Romanian category regardless of surrounding syntax', () => {
    expect(detectCategoryIntent('Antrenament piept', 'ro')).toBe('chest');
    expect(detectCategoryIntent('exercitii pentru piept', 'ro')).toBe('chest');
  });

  it('recognizes aliases without diacritics and across supported languages', () => {
    expect(detectCategoryIntent('antrenament pentru brate', 'ro')).toBe('arms');
    expect(detectCategoryIntent('ejercicios para hombros', 'es')).toBe('shoulders');
    expect(detectCategoryIntent('mga ehersisyo sa dibdib', 'tl')).toBe('chest');
  });

  it('leaves equipment and exercise-name searches without a category intent', () => {
    expect(detectCategoryIntent('smith machine workout', 'en')).toBeUndefined();
  });
});
