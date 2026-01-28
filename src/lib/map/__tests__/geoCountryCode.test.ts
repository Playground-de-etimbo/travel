import { describe, it, expect } from 'vitest';
import { getGeoCountryCode } from '@/lib/map/geoCountryCode';

describe('getGeoCountryCode', () => {
  it('returns ISO_A2 when present and not -99', () => {
    expect(getGeoCountryCode({ ISO_A2: 'GF', ISO_A2_EH: 'FR' })).toBe('GF');
  });

  it('returns iso_a2 when lowercase properties are present', () => {
    expect(getGeoCountryCode({ iso_a2: 'GF' })).toBe('GF');
  });

  it('falls back to ISO_A2_EH when ISO_A2 is -99', () => {
    expect(getGeoCountryCode({ ISO_A2: '-99', ISO_A2_EH: 'FR' })).toBe('FR');
  });

  it('returns null when no usable ISO codes exist', () => {
    expect(getGeoCountryCode({ ISO_A2: '-99', ISO_A2_EH: '-99' })).toBeNull();
  });
});
