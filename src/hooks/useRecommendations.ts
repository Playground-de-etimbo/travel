import { useState, useCallback, useEffect, useRef } from 'react';
import type { Country } from '@/types/country';
import type {
  BudgetTier,
  RecommendationPreferences,
  RecommendationResult,
  CountryEnrichedData,
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
  const latestRequestIdRef = useRef(0);

  // Load saved data from storage on mount
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const userData = await storage.load();

        // Load budget tier
        const storedTier = userData?.preferences?.recommendations?.budgetTier;
        if (storedTier) {
          setActiveTier(storedTier);
        }

        // Load saved recommendations and form preferences
        const savedRecommendations = userData?.recommendations;
        if (savedRecommendations) {
          setResult(savedRecommendations);

          // Restore form inputs from saved preferences
          if (savedRecommendations.preferences) {
            setPreferences(savedRecommendations.preferences);
          }
        }
      } catch (error) {
        console.warn('Failed to load saved data:', error);
      }
    };
    loadSavedData();
  }, []);

  const generate = useCallback(
    async (prefs: RecommendationPreferences) => {
      const requestId = ++latestRequestIdRef.current;
      setLoading(true);
      setError(null);

      // Yield once so urgent UI updates (selection highlight) paint first.
      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 0);
      });

      if (requestId !== latestRequestIdRef.current) return;

      // Reset failure counter for this new generation batch
      resetUnsplashFailures();

      try {
        // 1. Run algorithm
        const recs = await generateRecommendations(prefs, countries, beenTo);

        // If a newer request started, ignore this stale response.
        if (requestId !== latestRequestIdRef.current) return;

        // 2. Show recommendations immediately, then enrich images in background.
        const baseResult: RecommendationResult = {
          recommendations: recs,
          preferences: { ...prefs, lastGenerated: new Date() },
          generatedAt: new Date(),
          version: '1.0',
        };

        setResult(baseResult);
        setPreferences({ ...prefs, lastGenerated: new Date() });
        setHasGeneratedThisSession(true);
        setLoading(false);

        // Persist immediately visible result without blocking UI.
        void storage.update({ recommendations: baseResult }).catch((storageError) => {
          console.warn('Failed to save recommendations:', storageError);
        });

        // Enrich image URLs in background and only apply if this is still the latest request.
        void (async () => {
          const recsWithImages = await Promise.all(
            recs.map(async (rec) => {
              const country = countries.find((c) => c.countryCode === rec.countryCode);
              const imageData = country
                ? await fetchCountryImage(country.countryName).catch(() => null)
                : null;
              return {
                ...rec,
                imageUrl: imageData?.imageUrl ?? null,
                imagePhotographerName: imageData?.photographerName ?? null,
              };
            })
          );

          if (requestId !== latestRequestIdRef.current) return;

          const enrichedResult: RecommendationResult = {
            ...baseResult,
            recommendations: recsWithImages,
          };

          setResult(enrichedResult);
          void storage.update({ recommendations: enrichedResult }).catch((storageError) => {
            console.warn('Failed to save enriched recommendations:', storageError);
          });
        })();
      } catch (err) {
        if (requestId !== latestRequestIdRef.current) return;

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
        setLoading(false);
      }
    },
    [countries, beenTo]
  );

  // Save budget tier when it changes
  const handleTierChange = async (newTier: BudgetTier) => {
    setActiveTier(newTier);

    try {
      const userData = await storage.load();
      await storage.update({
        preferences: {
          theme: userData?.preferences?.theme ?? 'system',
          displayCurrency: userData?.preferences?.displayCurrency ?? 'USD',
          recommendations: {
            detectedCountry: userData?.preferences?.recommendations?.detectedCountry ?? null,
            budgetTier: newTier,
            detectionDismissed: userData?.preferences?.recommendations?.detectionDismissed ?? false,
          },
        },
      });
    } catch (error) {
      console.warn('Failed to save budget tier:', error);
    }
  };

  // Callback to update individual recommendation enriched data
  const updateEnrichedData = useCallback(
    (countryCode: string, data: CountryEnrichedData | null) => {
      setResult((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          recommendations: prev.recommendations.map((rec) =>
            rec.countryCode === countryCode
              ? { ...rec, enrichedData: data }
              : rec
          ),
        };
      });
    },
    []
  );

  return {
    preferences,
    setPreferences,
    result,
    activeTier,
    setActiveTier: handleTierChange,
    loading,
    error,
    generate,
    hasGeneratedThisSession,
    updateEnrichedData,
  };
}
