import { useState, useEffect, useCallback } from 'react';
import type { Country } from '@/types/country';
import type {
  BudgetTier,
  RecommendationPreferences,
  RecommendationResult,
} from '@/types/recommendation';
import { storage } from '@/lib/storage';
import { generateRecommendations } from '@/lib/recommendations/algorithm';
import { fetchCountryImage, resetUnsplashFailures } from '@/lib/api/unsplash';

export function useRecommendations(countries: Country[], beenTo: string[]) {
  const [preferences, setPreferences] = useState<RecommendationPreferences>({
    homeLocation: null,
    interests: [],
    maxFlightDuration: '6-12',
    lastGenerated: null,
  });
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [activeTier, setActiveTier] = useState<BudgetTier>('modest');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasGeneratedThisSession, setHasGeneratedThisSession] = useState(false);

  // Don't auto-load from localStorage - let user see samples first
  // Load from localStorage on mount (commented out to show samples first)
  // useEffect(() => {
  //   const loadSaved = async () => {
  //     try {
  //       const data = await storage.load();
  //       if (data?.recommendations) {
  //         setResult(data.recommendations);
  //         setPreferences(data.recommendations.preferences);
  //       }
  //     } catch (err) {
  //       console.error('Failed to load recommendations:', err);
  //     }
  //   };
  //   loadSaved();
  // }, []);

  const generate = useCallback(
    async (prefs: RecommendationPreferences) => {
      setLoading(true);
      setError(null);

      // Reset failure counter for this new generation batch
      resetUnsplashFailures();

      try {
        // 1. Run algorithm
        const recs = await generateRecommendations(prefs, countries, beenTo);

        // 2. Fetch images in parallel (with rate limiting handled by API)
        const recsWithImages = await Promise.all(
          recs.map(async (rec) => {
            const country = countries.find(
              (c) => c.countryCode === rec.countryCode
            );
            const imageUrl = country
              ? await fetchCountryImage(country.countryName).catch(() => null)
              : null;
            return { ...rec, imageUrl };
          })
        );

        // 3. Save to storage
        const newResult: RecommendationResult = {
          recommendations: recsWithImages,
          preferences: { ...prefs, lastGenerated: new Date() },
          generatedAt: new Date(),
          version: '1.0',
        };

        await storage.update({ recommendations: newResult });

        setResult(newResult);
        setPreferences({ ...prefs, lastGenerated: new Date() });
        setHasGeneratedThisSession(true);
      } catch (err) {
        let errorMessage: Error;

        if (err instanceof Error) {
          // Provide user-friendly error messages
          if (err.message.includes('coordinates for selected country')) {
            errorMessage = err; // Use the detailed message from algorithm
          } else if (err.message.includes('No countries found')) {
            errorMessage = new Error(
              'No destinations found matching your criteria. Try increasing your flight duration or changing your interests.'
            );
          } else {
            errorMessage = err;
          }
        } else {
          errorMessage = new Error('Failed to generate recommendations. Please try again.');
        }

        setError(errorMessage);
        console.error('Recommendation generation failed:', err);
      } finally {
        setLoading(false);
      }
    },
    [countries, beenTo]
  );

  return {
    preferences,
    setPreferences,
    result,
    activeTier,
    setActiveTier,
    loading,
    error,
    generate,
    hasGeneratedThisSession,
  };
}
