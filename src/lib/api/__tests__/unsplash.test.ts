import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchCountryImage, resetUnsplashFailures } from '../unsplash';

// Mock fetch
global.fetch = vi.fn();

describe('fetchCountryImage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetUnsplashFailures();
  });

  it('returns null when API key is not configured', async () => {
    const result = await fetchCountryImage('Japan');
    expect(result).toBeNull();
  });

  it('stops making requests after hitting consecutive failure limit', async () => {
    // This test ensures no infinite loops
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
    global.fetch = mockFetch;

    // Call multiple times
    for (let i = 0; i < 10; i++) {
      await fetchCountryImage('Japan');
    }

    // Should only attempt 3 times (maxConsecutiveFailures = 3)
    // Plus the initial check attempts
    expect(mockFetch.mock.calls.length).toBeLessThan(10);
  });

  it('resets failure counter on new generation', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
    global.fetch = mockFetch;

    // Trigger failures
    await fetchCountryImage('Japan');
    await fetchCountryImage('Italy');
    await fetchCountryImage('Thailand');

    // Reset
    resetUnsplashFailures();

    // Should be able to try again
    await fetchCountryImage('Spain');

    expect(mockFetch).toHaveBeenCalled();
  });
});
