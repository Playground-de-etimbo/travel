import { useEffect } from 'react';
import type { CountryRecommendation, CountryEnrichedData } from '@/types/recommendation';
import { fetchCountryEnrichedData } from '@/lib/api/restCountries';

/**
 * Hook to fetch enriched country data in background after recommendations render
 * @param recommendations Array of recommendations to enrich
 * @param onUpdate Callback to update individual recommendation enriched data
 */
export function useCountryEnrichment(
  recommendations: CountryRecommendation[],
  onUpdate: (countryCode: string, data: CountryEnrichedData | null) => void
) {
  useEffect(() => {
    if (recommendations.length === 0) return;

    const fetchAll = async () => {
      await Promise.allSettled(
        recommendations.map(async (rec) => {
          // Skip if already fetched
          if (rec.enrichedData !== undefined) return;

          // Set loading state immediately
          onUpdate(rec.countryCode, null);

          // Fetch data
          const data = await fetchCountryEnrichedData(rec.countryCode);

          // Update with result
          onUpdate(rec.countryCode, data);
        })
      );
    };

    fetchAll();
  }, [recommendations, onUpdate]);
}
