import { useMemo } from 'react';
import { PreferencesForm } from './PreferencesForm';
import { BudgetSlider } from './BudgetSlider';
import { RecommendationsGrid } from './RecommendationsGrid';
import { LoadingState } from './LoadingState';
import { SampleResults } from './SampleResults';
import { useRecommendations } from '@/hooks/useRecommendations';
import { useGeolocation } from '@/hooks/useGeolocation';
import { hasCoordinates } from '@/data/countryCoordinates';
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
  } = useRecommendations(countries, beenTo);

  // Get countries with coordinates for geolocation
  const availableCountries = useMemo(
    () => countries.filter((country) => hasCoordinates(country.countryCode)),
    [countries]
  );

  // Use geolocation hook
  const {
    detectedCountry,
    isDetecting,
    isDismissed,
    dismissDetection,
  } = useGeolocation(availableCountries);

  return (
    <section id="recommendations" className="py-16 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="mb-6 pb-4 border-b border-border/30">
          <h2 className="text-2xl font-bold mb-1.5 tracking-tight">Personalized Recommendations</h2>
          <p className="text-sm text-muted-foreground/80">
            AI-powered suggestions based on your preferences
          </p>
        </div>

        <PreferencesForm
          countries={countries}
          onSubmit={generate}
          onHomeSelected={(code) => addCountry(code)}
          loading={loading || isDetecting}
          detectedCountry={detectedCountry}
          onDetectionDismiss={dismissDetection}
          showDetectionBadge={!isDismissed && detectedCountry !== null}
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

        {/* Show sample results if no real results yet */}
        {!result && !loading && <SampleResults />}

        {/* Show loading message */}
        {loading && (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground animate-pulse">
              Generating your personalized recommendations...
            </p>
          </div>
        )}

        {/* Show loading state or results */}
        {loading && <LoadingState />}

        {result && !loading && (
          <RecommendationsGrid
            recommendations={result.recommendations}
            countries={countries}
            tier={activeTier}
            onRegenerate={() => generate(preferences)}
          />
        )}
      </div>
    </section>
  );
}
