/**
 * Geographic coordinates (latitude, longitude) for countries
 * Source: Capital city or geographic center
 */
export const countryCoordinates: Record<string, { lat: number; lng: number }> = {
  // North America
  US: { lat: 38.8951, lng: -77.0364 },     // United States
  CA: { lat: 45.4215, lng: -75.6972 },     // Canada
  MX: { lat: 19.4326, lng: -99.1332 },     // Mexico

  // Europe
  GB: { lat: 51.5074, lng: -0.1278 },      // United Kingdom
  FR: { lat: 48.8566, lng: 2.3522 },       // France
  DE: { lat: 52.5200, lng: 13.4050 },      // Germany
  IT: { lat: 41.9028, lng: 12.4964 },      // Italy
  ES: { lat: 40.4168, lng: -3.7038 },      // Spain
  PT: { lat: 38.7223, lng: -9.1393 },      // Portugal
  NL: { lat: 52.3676, lng: 4.9041 },       // Netherlands
  BE: { lat: 50.8503, lng: 4.3517 },       // Belgium
  CH: { lat: 46.9480, lng: 7.4474 },       // Switzerland
  AT: { lat: 48.2082, lng: 16.3738 },      // Austria
  GR: { lat: 37.9838, lng: 23.7275 },      // Greece
  PL: { lat: 52.2297, lng: 21.0122 },      // Poland
  CZ: { lat: 50.0755, lng: 14.4378 },      // Czech Republic
  SE: { lat: 59.3293, lng: 18.0686 },      // Sweden
  NO: { lat: 59.9139, lng: 10.7522 },      // Norway
  DK: { lat: 55.6761, lng: 12.5683 },      // Denmark
  FI: { lat: 60.1699, lng: 24.9384 },      // Finland
  IS: { lat: 64.1466, lng: -21.9426 },     // Iceland
  IE: { lat: 53.3498, lng: -6.2603 },      // Ireland

  // Asia
  JP: { lat: 35.6762, lng: 139.6503 },     // Japan
  CN: { lat: 39.9042, lng: 116.4074 },     // China
  IN: { lat: 28.6139, lng: 77.2090 },      // India
  TH: { lat: 13.7563, lng: 100.5018 },     // Thailand
  VN: { lat: 21.0285, lng: 105.8542 },     // Vietnam
  KR: { lat: 37.5665, lng: 126.9780 },     // South Korea
  SG: { lat: 1.3521, lng: 103.8198 },      // Singapore
  MY: { lat: 3.1390, lng: 101.6869 },      // Malaysia
  ID: { lat: -6.2088, lng: 106.8456 },     // Indonesia
  PH: { lat: 14.5995, lng: 120.9842 },     // Philippines
  AE: { lat: 25.2048, lng: 55.2708 },      // UAE
  TR: { lat: 39.9334, lng: 32.8597 },      // Turkey
  IL: { lat: 31.7683, lng: 35.2137 },      // Israel

  // Oceania
  AU: { lat: -35.2809, lng: 149.1300 },    // Australia
  NZ: { lat: -41.2865, lng: 174.7762 },    // New Zealand
  FJ: { lat: -18.1248, lng: 178.4501 },    // Fiji

  // South America
  BR: { lat: -15.7975, lng: -47.8919 },    // Brazil
  AR: { lat: -34.6037, lng: -58.3816 },    // Argentina
  CL: { lat: -33.4489, lng: -70.6693 },    // Chile
  PE: { lat: -12.0464, lng: -77.0428 },    // Peru
  CO: { lat: 4.7110, lng: -74.0721 },      // Colombia
  CR: { lat: 9.9281, lng: -84.0907 },      // Costa Rica

  // Africa
  ZA: { lat: -25.7479, lng: 28.2293 },     // South Africa
  EG: { lat: 30.0444, lng: 31.2357 },      // Egypt
  MA: { lat: 33.9716, lng: -6.8498 },      // Morocco
  KE: { lat: -1.2864, lng: 36.8172 },      // Kenya
  TZ: { lat: -6.7924, lng: 39.2083 },      // Tanzania
};

/**
 * Get coordinates for a country code
 * @param countryCode ISO 3166-1 alpha-2 country code
 * @returns Coordinates or null if not found
 */
export function getCountryCoordinates(
  countryCode: string
): { lat: number; lng: number } | null {
  return countryCoordinates[countryCode] || null;
}

/**
 * Check if a country has coordinate data available
 * @param countryCode ISO 3166-1 alpha-2 country code
 * @returns True if coordinates are available
 */
export function hasCoordinates(countryCode: string): boolean {
  return countryCode in countryCoordinates;
}
