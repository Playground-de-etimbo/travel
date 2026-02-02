const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

// Rate limiting: Track requests and implement exponential backoff
const rateLimiter = {
  requestCount: 0,
  lastReset: Date.now(),
  isRateLimited: false,
  rateLimitUntil: 0,
  consecutiveFailures: 0, // Track failures in current batch
  maxConsecutiveFailures: 3, // Give up after this many failures (reduced from 5)
  hasLoggedGiveUp: false, // Prevent spam logging
  hasLoggedRateLimit: false, // Prevent spam logging
};

const MAX_REQUESTS_PER_MINUTE = 40; // Generous limit (Unsplash allows 50/hour = ~0.83/min)
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

/**
 * Fetch a country image from Unsplash with rate limiting
 * @param countryName Name of the country
 * @returns Image URL or null if fetch fails
 */
export async function fetchCountryImage(
  countryName: string
): Promise<string | null> {
  if (!UNSPLASH_ACCESS_KEY) {
    console.warn('Unsplash API key not configured');
    return null;
  }

  // Give up if we've had too many consecutive failures in this batch
  if (rateLimiter.consecutiveFailures >= rateLimiter.maxConsecutiveFailures) {
    // Only log once per batch
    if (!rateLimiter.hasLoggedGiveUp) {
      console.warn(
        `Giving up on photo fetching after ${rateLimiter.consecutiveFailures} consecutive failures. Using emoji fallbacks for remaining recommendations.`
      );
      rateLimiter.hasLoggedGiveUp = true;
    }
    return null;
  }

  // Check if we're currently rate limited - silently return null
  if (rateLimiter.isRateLimited && Date.now() < rateLimiter.rateLimitUntil) {
    rateLimiter.consecutiveFailures++;
    return null; // Already logged when we first hit the limit
  }

  // Reset counter if window has passed
  if (Date.now() - rateLimiter.lastReset > RATE_LIMIT_WINDOW) {
    rateLimiter.requestCount = 0;
    rateLimiter.lastReset = Date.now();
    rateLimiter.isRateLimited = false;
  }

  // Check if we've hit our local limit
  if (rateLimiter.requestCount >= MAX_REQUESTS_PER_MINUTE) {
    // Only log the first time we hit the limit
    if (!rateLimiter.isRateLimited) {
      console.warn('Local rate limit reached (40/min). Using emoji fallbacks for photos.');
      rateLimiter.isRateLimited = true;
      rateLimiter.rateLimitUntil = rateLimiter.lastReset + RATE_LIMIT_WINDOW;
      rateLimiter.hasLoggedRateLimit = true;
    }
    rateLimiter.consecutiveFailures++;
    return null;
  }

  try {
    rateLimiter.requestCount++;

    const query = `${countryName} travel landmark`;
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
      query
    )}&per_page=1&orientation=landscape`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });

    // Handle 429 (rate limit) from Unsplash
    if (response.status === 429) {
      // Only log the first time we hit the limit
      if (!rateLimiter.isRateLimited) {
        console.warn(
          'Unsplash API rate limit (429). Photos disabled for 1 hour. Using emoji fallbacks.'
        );
        rateLimiter.isRateLimited = true;
        rateLimiter.rateLimitUntil = Date.now() + 60 * 60 * 1000; // 1 hour
        rateLimiter.hasLoggedRateLimit = true;
      }
      rateLimiter.consecutiveFailures++;
      return null;
    }

    if (!response.ok) {
      rateLimiter.consecutiveFailures++;
      // Only log non-rate-limit errors if we haven't given up yet
      if (rateLimiter.consecutiveFailures < rateLimiter.maxConsecutiveFailures) {
        console.warn(`Unsplash API error: ${response.status}`);
      }
      return null;
    }

    const data = await response.json();
    const imageUrl = data.results[0]?.urls?.regular || null;

    // Success! Reset consecutive failures counter
    if (imageUrl) {
      rateLimiter.consecutiveFailures = 0;
    }

    return imageUrl;
  } catch (error) {
    rateLimiter.consecutiveFailures++;
    // Only log network errors if we haven't given up yet
    if (rateLimiter.consecutiveFailures < rateLimiter.maxConsecutiveFailures) {
      console.warn('Failed to fetch image from Unsplash:', error);
    }
    return null;
  }
}

/**
 * Reset the consecutive failures counter (call this at start of new generation)
 */
export function resetUnsplashFailures() {
  rateLimiter.consecutiveFailures = 0;
  rateLimiter.hasLoggedGiveUp = false;
  rateLimiter.hasLoggedRateLimit = false;
}
