interface IpApiResponse {
  country_code: string;
  country_name: string;
  // ipapi.co returns many more fields, but we only need these
}

/**
 * Detect user's country using ipapi.co geolocation service.
 * Throws an error if detection fails - let the caller handle fallback logic.
 *
 * Note: ipapi.co supports CORS from browser origins and HTTPS on free tier
 * (1,000 requests/day — fine since we cache the result in localStorage).
 *
 * @returns Country code (ISO 3166-1 alpha-2)
 * @throws Error if geolocation detection fails
 */
export async function detectUserCountry(): Promise<string> {
  const response = await fetch('https://ipapi.co/json/', {
    signal: AbortSignal.timeout(5000), // 5 second timeout
  });

  if (!response.ok) {
    throw new Error('Geolocation API failed');
  }

  const data: IpApiResponse = await response.json();

  if (!data.country_code) {
    throw new Error('Invalid API response');
  }

  return data.country_code;
}
