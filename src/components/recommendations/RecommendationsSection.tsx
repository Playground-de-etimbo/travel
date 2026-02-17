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

export function RecommendationsSection({
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

  return (
    <section
      id="recommendations"
      className="pt-16 pb-16 relative"
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-6">
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
              recommendations={result.recommendations}
              countries={countries}
              tier={activeTier}
              onRegenerate={() => generate(preferences)}
            />
          )}
        </div>
      </div>
    </section>
  );
}
