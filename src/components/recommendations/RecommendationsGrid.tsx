import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RecommendationCard } from './RecommendationCard';
import type { CountryRecommendation, BudgetTier } from '@/types/recommendation';
import type { Country } from '@/types/country';

interface RecommendationsGridProps {
  recommendations: CountryRecommendation[];
  countries: Country[];
  tier: BudgetTier;
  onRegenerate: () => void;
}

export function RecommendationsGrid({
  recommendations,
  countries,
  tier,
  onRegenerate,
}: RecommendationsGridProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">
          {recommendations.length} Recommendations
        </h3>
        <Button onClick={onRegenerate} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Get New Recommendations
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {recommendations.map((rec) => {
          const country = countries.find((c) => c.countryCode === rec.countryCode);
          if (!country) return null;

          return (
            <RecommendationCard
              key={rec.countryCode}
              recommendation={rec}
              country={country}
              tier={tier}
            />
          );
        })}
      </div>
    </div>
  );
}
