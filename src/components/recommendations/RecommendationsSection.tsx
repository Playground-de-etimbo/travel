import { useCallback, useEffect, useMemo, useRef } from 'react';
import { PreferencesForm } from './PreferencesForm';
import { BudgetSlider } from './BudgetSlider';
import { RecommendationsGrid } from './RecommendationsGrid';
import { LoadingState } from './LoadingState';
import { SampleResults } from './SampleResults';
import { useRecommendations } from '@/hooks/useRecommendations';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useCountryEnrichment } from '@/hooks/useCountryEnrichment';
import type { Country } from '@/types/country';

interface RecommendationsSectionProps {
  countries: Country[];
  beenTo: string[];
  addCountry: (countryCode: string) => void;
}

export default function RecommendationsSection({
  countries,
  beenTo,
  addCountry,
}: RecommendationsSectionProps) {
  const {
    preferences,
    result,
    activeTier,
    loading,
    error,
    generate,
    setActiveTier,
    updateEnrichedData,
  } = useRecommendations(countries, beenTo);

  // Trigger background enrichment after recommendations are generated
  useCountryEnrichment(
    result?.recommendations || [],
    updateEnrichedData
  );

  // Use geolocation hook (runs independently of country loading)
  const {
    detectedCountry,
    isDismissed,
    dismissDetection,
  } = useGeolocation();

  const handleRegenerate = useCallback(() => generate(preferences), [generate, preferences]);

  // Auto-refresh recommendations once when the section first scrolls into view
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasAutoRefreshed = useRef(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (
          entry.isIntersecting &&
          !hasAutoRefreshed.current &&
          result &&
          preferences.homeLocation
        ) {
          hasAutoRefreshed.current = true;
          generate(preferences);
          observer.disconnect();
        }
      },
      { threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [result, preferences, generate]);

  // Filter out countries the user has since marked as "been to"
  const filteredRecommendations = useMemo(
    () => result?.recommendations.filter(rec => !beenTo.includes(rec.countryCode)) ?? [],
    [result, beenTo]
  );

  return (
    <section
      id="recommendations"
      className="pt-16 pb-16 relative"
    >
      <div className="container mx-auto px-4 relative z-10">
        <div ref={sectionRef} className="mb-6">
          <span className="eyebrow-recommendations text-sm font-semibold uppercase tracking-wider block">
            AI-Powered Discovery
          </span>
          <h2 className="text-5xl font-extrabold mt-4 mb-2 tracking-tight leading-tight text-foreground">
            Personalized Recommendations
          </h2>
          <p className="text-base text-muted-foreground max-w-4xl">
            Tell us what moves you, and we'll find destinations that match your travel dreams
          </p>
        </div>

        <PreferencesForm
          countries={countries}
          onSubmit={generate}
          onHomeSelected={(code) => addCountry(code)}
          detectedCountry={detectedCountry}
          onDetectionDismiss={dismissDetection}
          showDetectionBadge={!isDismissed && detectedCountry !== null}
          savedPreferences={preferences}
        />

        {error && (
          <div className="text-center py-8">
            <p className="text-destructive font-medium mb-2">
              {error.message}
            </p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your preferences and try again.
            </p>
          </div>
        )}

        {/* Show BudgetSlider always */}
        <BudgetSlider tier={activeTier} onTierChange={setActiveTier} />

        {/* Stable height container to prevent CLS when swapping content states */}
        <div style={{ minHeight: '500px' }}>
          {/* Show sample results if no real results yet */}
          {!result && !loading && <SampleResults />}

          {/* Show loading message */}
          {loading && (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground animate-pulse">
                {result
                  ? 'Updating recommendations...'
                  : 'Generating your personalized recommendations...'}
              </p>
            </div>
          )}

          {/* Show loading state only before first result to avoid full-grid flicker */}
          {loading && !result && <LoadingState />}

          {result && (
            <RecommendationsGrid
              recommendations={filteredRecommendations}
              countries={countries}
              tier={activeTier}
              onRegenerate={handleRegenerate}
            />
          )}
        </div>
      </div>
    </section>
  );
}
