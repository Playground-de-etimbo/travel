import { useState, useEffect } from 'react';
import { detectUserCountry } from '@/lib/api/geolocation';
import { storage } from '@/lib/storage';
import type { Country } from '@/types/country';

interface UseGeolocationResult {
  detectedCountry: string | null;
  isDetecting: boolean;
  isDismissed: boolean;
  dismissDetection: () => void;
}

/**
 * Hook to manage auto-detection of user's country via IP geolocation.
 * Detects country once on first visit and stores result in localStorage.
 * Subsequent visits use the cached value without re-detecting.
 */
export function useGeolocation(availableCountries: Country[]): UseGeolocationResult {
  const [detectedCountry, setDetectedCountry] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const initializeGeolocation = async () => {
      try {
        // Check if we already have a detected country in storage
        const userData = await storage.load();
        const stored = userData?.preferences?.recommendations?.detectedCountry;
        const wasDismissed = userData?.preferences?.recommendations?.detectionDismissed ?? false;

        if (stored !== undefined) {
          // Already detected, use stored value
          setDetectedCountry(stored);
          setIsDismissed(wasDismissed);
          setIsDetecting(false);
          return;
        }

        // Detect country
        const countryCode = await detectUserCountry();

        // Verify country is in our available list
        const isAvailable = availableCountries.some(c => c.countryCode === countryCode);
        const finalCountry = isAvailable ? countryCode : 'AU';

        // Save to storage
        const currentData = await storage.load();
        await storage.update({
          preferences: {
            theme: currentData?.preferences?.theme ?? 'system',
            displayCurrency: currentData?.preferences?.displayCurrency ?? 'USD',
            recommendations: {
              detectedCountry: finalCountry,
              budgetTier: currentData?.preferences?.recommendations?.budgetTier ?? 'modest',
              detectionDismissed: false,
            },
          },
        });

        setDetectedCountry(finalCountry);
        setIsDetecting(false);
      } catch (error) {
        console.error('Geolocation initialization failed:', error);
        setDetectedCountry('AU'); // Fallback
        setIsDetecting(false);
      }
    };

    initializeGeolocation();
  }, [availableCountries]);

  const dismissDetection = async () => {
    setIsDismissed(true);

    // Update storage
    try {
      const userData = await storage.load();
      await storage.update({
        preferences: {
          theme: userData?.preferences?.theme ?? 'system',
          displayCurrency: userData?.preferences?.displayCurrency ?? 'USD',
          recommendations: {
            detectedCountry: detectedCountry,
            budgetTier: userData?.preferences?.recommendations?.budgetTier ?? 'modest',
            detectionDismissed: true,
          },
        },
      });
    } catch (error) {
      console.error('Failed to update detection dismissal:', error);
    }
  };

  return {
    detectedCountry,
    isDetecting,
    isDismissed,
    dismissDetection,
  };
}
