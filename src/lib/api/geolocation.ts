interface IpWhoisResponse {
  country_code: string;
  country: string;
  success: boolean;
  // ipwhois.app returns many more fields, but we only need these
}

/**
 * Detect user's country using ipwhois.app geolocation service.
 * Defaults to "AU" (Australia) if detection fails.
 *
 * Note: ipwhois.app supports HTTPS on free tier (10k requests/month),
 * making it compatible with HTTPS deployments (avoids mixed content errors).
 *
 * @returns Country code (ISO 3166-1 alpha-2)
 */
export async function detectUserCountry(): Promise<string> {
  try {
    const response = await fetch('https://ipwhois.app/json/', {
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });

    if (!response.ok) {
      throw new Error('Geolocation API failed');
    }

    const data: IpWhoisResponse = await response.json();

    // Check if API returned valid country code
    if (!data.success || !data.country_code) {
      throw new Error('Invalid API response');
    }

    return data.country_code;
  } catch (error) {
    console.warn('Country detection failed, defaulting to AU:', error);
    return 'AU'; // Default to Australia
  }
}
