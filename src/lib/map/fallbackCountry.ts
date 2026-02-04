import type { Country } from '@/types';
import { getCountryFlag } from './flagEmoji';
import { getGeoCountryCode } from './geoCountryCode';

/**
 * Creates a minimal Country object from GeoJSON properties.
 * Used as a fallback when a country isn't in countries.json.
 *
 * Only countryCode, countryName, continent, region, and flagEmoji are populated with real data.
 * Other fields use placeholder values since they're not displayed in tooltips.
 */
export function createFallbackCountry(geoProperties: any): Country | null {
  const countryCode = getGeoCountryCode(geoProperties);
  const countryName = geoProperties?.NAME ?? geoProperties?.name ?? geoProperties?.ADMIN ?? geoProperties?.admin;
  const continent = geoProperties?.CONTINENT ?? geoProperties?.continent;
  const region =
    geoProperties?.REGION_WB ??
    geoProperties?.region_wb ??
    continent;

  // Validate required fields exist
  if (!countryCode || !countryName || !continent || !region) {
    console.warn('Missing required GeoJSON properties for fallback country:', geoProperties);
    return null;
  }

  return {
    countryCode,
    countryName,
    continent,
    region,
    flagEmoji: getCountryFlag(countryCode),
    // Placeholder values for fields not used in tooltips
    currencyCode: 'USD',
    currencyName: 'US Dollar',
    description: 'Highlights vary by region and season. Explore local culture, food, and landscapes.',
    baselineCost: 0,
    nightlyCost: 0,
    interests: [], // No interests for fallback countries
  };
}
