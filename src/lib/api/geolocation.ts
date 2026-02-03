interface IpApiResponse {
  status: string;
  countryCode: string;
  country: string;
  // ip-api.com returns many more fields, but we only need these
}

/**
 * Detect user's country using ip-api.com geolocation service.
 * Defaults to "AU" (Australia) if detection fails.
 *
 * Note: Uses HTTP (not HTTPS) as ip-api.com free tier only supports HTTP.
 * This is acceptable for approximate location hints.
 *
 * @returns Country code (ISO 3166-1 alpha-2)
 */
export async function detectUserCountry(): Promise<string> {
  try {
    const response = await fetch('http://ip-api.com/json/', {
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    if (!response.ok) {
      throw new Error('Geolocation API failed');
    }

    const data: IpApiResponse = await response.json();

    // Check if API returned an error
    if (data.status !== 'success' || !data.countryCode) {
      throw new Error('Invalid API response');
    }

    return data.countryCode;
  } catch (error) {
    console.warn('Country detection failed, defaulting to AU:', error);
    return 'AU'; // Default to Australia
  }
}
