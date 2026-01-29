export interface Country {
  countryCode: string;        // ISO 3166-1 alpha-2 (e.g., "US")
  countryName: string;         // Full name (e.g., "United States")
  continent: string;           // Continent (e.g., "North America")
  region: string;              // World Bank region (e.g., "Latin America & Caribbean")
  currencyCode: string;        // ISO 4217 (e.g., "USD")
  currencyName: string;        // Full currency name (e.g., "US Dollar")
  flagEmoji: string;           // Unicode flag (e.g., "🇺🇸")
  baselineCost: number;        // Estimated baseline cost in USD
  nightlyCost: number;         // Estimated nightly cost in USD
}

export interface CountryState {
  countryCode: string;
  status: 'neutral' | 'beenTo' | 'wantToGo';
}
