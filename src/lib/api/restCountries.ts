import type { CountryEnrichedData } from '@/types/recommendation';

const REST_COUNTRIES_BASE = 'https://restcountries.com/v3.1';
const CACHE_PREFIX = 'rest_countries_';
const CACHE_VERSION = 'v2'; // Incremented to clear old cache with singular demonyms and 'Unknown' capitals

/**
 * Pluralize English demonyms
 * Handles common cases and exceptions
 */
function pluralizeDemonym(singular: string): string {
  // Already plural or same in singular/plural
  const unchanging = ['Japanese', 'Chinese', 'Swiss', 'Portuguese', 'Vietnamese', 'Lebanese', 'Congolese', 'Senegalese', 'Maltese'];
  if (unchanging.includes(singular)) {
    return singular;
  }

  // Special cases
  const exceptions: Record<string, string> = {
    'person': 'people',
    'German': 'Germans',
    'American': 'Americans',
    'Australian': 'Australians',
    'Canadian': 'Canadians',
    'Mexican': 'Mexicans',
    'Brazilian': 'Brazilians',
    'French': 'French', // Same in plural
    'Dutch': 'Dutch',   // Same in plural
    'British': 'British', // Same in plural
    'Irish': 'Irish',   // Same in plural
    'Spanish': 'Spanish', // Same in plural
    'Finnish': 'Finnish', // Same in plural
    'Polish': 'Polish', // Same in plural
    'Danish': 'Danish', // Same in plural
    'Swedish': 'Swedish', // Same in plural
    'Turkish': 'Turkish', // Same in plural
  };

  if (exceptions[singular]) {
    return exceptions[singular];
  }

  // Default: add 's' for most demonyms ending in consonants
  if (singular.endsWith('i') || singular.endsWith('ese') || singular.endsWith('ish') || singular.endsWith('ch')) {
    return singular; // Likely already works as plural
  }

  return singular + 's';
}

/**
 * Fetch enriched country data (currency, language, demonym) from REST Countries API
 * @param countryCode ISO 3166-1 alpha-2 country code (e.g., "JP")
 * @returns Enriched data or null if fetch fails
 */
export async function fetchCountryEnrichedData(
  countryCode: string
): Promise<CountryEnrichedData | null> {
  // 1. Check localStorage cache
  const cacheKey = `${CACHE_PREFIX}${countryCode}_${CACHE_VERSION}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached) as CountryEnrichedData;
    } catch {
      localStorage.removeItem(cacheKey);
    }
  }

  // 2. Fetch from API
  try {
    const url = `${REST_COUNTRIES_BASE}/alpha/${countryCode.toLowerCase()}?fields=languages,currencies,demonyms,capital`;
    const response = await fetch(url);

    if (!response.ok) {
      console.warn(`REST Countries API error for ${countryCode}: ${response.status}`);
      return null;
    }

    const data = await response.json();

    // 3. Extract data (API returns array for /alpha endpoint)
    const country = Array.isArray(data) ? data[0] : data;

    const language = Object.values(country.languages || {})[0] as string || 'who knows what';
    const currencyCode = Object.keys(country.currencies || {})[0] || 'USD';
    const demonymSingular = country.demonyms?.eng?.m || 'people';
    // Pluralize the demonym (simple English pluralization)
    const demonym = pluralizeDemonym(demonymSingular);
    const capital = Array.isArray(country.capital) ? country.capital[0] : country.capital || null;

    const enrichedData: CountryEnrichedData = {
      currency: currencyCode,
      language,
      demonym,
      capital,
    };

    // 4. Cache indefinitely
    localStorage.setItem(cacheKey, JSON.stringify(enrichedData));

    return enrichedData;
  } catch (error) {
    console.warn(`Failed to fetch enriched data for ${countryCode}:`, error);
    return null;
  }
}
