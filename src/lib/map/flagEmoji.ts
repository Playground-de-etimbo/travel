/**
 * Converts an ISO 3166-1 alpha-2 country code to a flag emoji.
 * Uses Unicode regional indicator symbols.
 *
 * @param countryCode - Two-letter country code (e.g., "US", "RU")
 * @returns Flag emoji (e.g., "🇺🇸", "🇷🇺")
 */
export function getCountryFlag(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) {
    return '🏳️'; // White flag fallback for invalid codes
  }

  // Convert each letter to regional indicator symbol
  // A = 0x1F1E6, B = 0x1F1E7, ..., Z = 0x1F1FF
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 0x1F1E6 + char.charCodeAt(0) - 65);

  return String.fromCodePoint(...codePoints);
}
