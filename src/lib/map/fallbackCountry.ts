import type { Country } from '@/types';
import { getCountryFlag } from './flagEmoji';
import { getGeoCountryCode } from './geoCountryCode';

/**
 * Creates a minimal Country object from GeoJSON properties.
 * Used as a fallback when a country isn't in countries.json.
 *
 * Only countryCode, countryName, region, and flagEmoji are populated with real data.
 * Other fields use placeholder values since they're not displayed in tooltips.
 */
export function createFallbackCountry(geoProperties: any): Country | null {
  const countryCode = getGeoCountryCode(geoProperties);
  const countryName = geoProperties?.NAME ?? geoProperties?.name ?? geoProperties?.ADMIN ?? geoProperties?.admin;
  const region = geoProperties?.CONTINENT ?? geoProperties?.continent;

  // Validate required fields exist
  if (!countryCode || !countryName || !region) {
    console.warn('Missing required GeoJSON properties for fallback country:', geoProperties);
    return null;
  }

  return {
    countryCode,
    countryName,
    region,
    flagEmoji: getCountryFlag(countryCode),
    // Placeholder values for fields not used in tooltips
    currencyCode: 'USD',
    currencyName: 'US Dollar',
    baselineCost: 0,
    nightlyCost: 0,
  };
}
