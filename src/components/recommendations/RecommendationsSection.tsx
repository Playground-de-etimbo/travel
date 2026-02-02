import { PreferencesForm } from './PreferencesForm';
import { BudgetSlider } from './BudgetSlider';
import { RecommendationsGrid } from './RecommendationsGrid';
import { LoadingState } from './LoadingState';
import { SampleResults } from './SampleResults';
import { useRecommendations } from '@/hooks/useRecommendations';
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

  return (
    <section id="recommendations" className="py-16 border-t border-border">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-2">Personalized Recommendations</h2>
        <p className="text-muted-foreground mb-8">
          AI-powered suggestions based on your preferences
        </p>

        <PreferencesForm
          countries={countries}
          onSubmit={generate}
          onHomeSelected={(code) => addCountry(code)}
          loading={loading}
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
