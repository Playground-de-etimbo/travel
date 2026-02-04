import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { CountryRecommendation, BudgetTier } from '@/types/recommendation';
import type { Country } from '@/types/country';

interface RecommendationCardProps {
  recommendation: CountryRecommendation;
  country: Country;
  tier: BudgetTier;
}

/**
 * Get currency symbol for a currency code
 * TEMPORARILY UNUSED - will be needed when price table is restored
 */
// function getCurrencySymbol(currencyCode: string): string {
//   const symbols: Record<string, string> = {
//     USD: '$',
//     EUR: '€',
//     GBP: '£',
//     JPY: '¥',
//     AUD: 'A$',
//     CAD: 'C$',
//     CHF: 'Fr',
//     CNY: '¥',
//     INR: '₹',
//     KRW: '₩',
//     MXN: 'Mex$',
//     NZD: 'NZ$',
//     SEK: 'kr',
//     SGD: 'S$',
//   };
//   return symbols[currencyCode] || currencyCode;
// }

export function RecommendationCard({
  recommendation,
  country,
  tier: _tier, // Prefixed with _ to indicate intentionally unused (for price table later)
}: RecommendationCardProps) {
  const { imageUrl, matchScore, enrichedData } = recommendation;
  const { countryName, flagEmoji, description } = country;
  const [imageLoaded, setImageLoaded] = useState(false);

  // Temporarily unused while price table is hidden
  // const cost = costs[tier];
  // const currencySymbol = enrichedData ? getCurrencySymbol(enrichedData.currency) : '$';

  return (
    <Card className="overflow-hidden hover:shadow-lg hover:scale-[1.01] transition-all duration-300 recommendation-card border-border/50">
      <div className="flex flex-col md:flex-row">
        {/* Image section with match badge overlay */}
        <div className="md:w-2/5 h-48 md:h-auto relative bg-gradient-to-br from-accent/20 to-primary/20">
          {/* Flag emoji - always visible as fallback */}
          <div className="absolute inset-0 flex items-center justify-center text-6xl">
            {flagEmoji}
          </div>

          {/* Photo overlay - fades in when loaded */}
          {imageUrl && (
            <img
              src={imageUrl}
              alt={countryName}
              onLoad={() => setImageLoaded(true)}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}

          {/* Match score badge - overlaid on image (left-aligned) */}
          <div className="absolute top-3 left-3">
            <Badge
              variant="secondary"
              className="bg-background/95 backdrop-blur-sm text-accent border-accent/30 shadow-lg"
              aria-label={`${matchScore}% match score`}
            >
              <Heart className="w-3 h-3 mr-1 fill-accent" />
              {matchScore}% match
            </Badge>
          </div>
        </div>

        {/* Content section */}
        <CardContent className="md:w-3/5 p-5">
          {/* Country name header */}
          <h3 className="text-lg font-bold leading-tight mb-2">
            {flagEmoji} {countryName}
          </h3>

          {/* Full description from country data */}
          <p className="text-sm text-muted-foreground/90 mb-3 leading-relaxed">
            {description}
          </p>

          {/* Playful verb line + capital city */}
          {enrichedData === null && (
            <div className="h-5 w-56 bg-muted animate-pulse rounded-full" />
          )}

          {enrichedData && (
            <div className="bg-muted/30 border border-muted rounded-lg p-3 text-xs text-muted-foreground space-y-1">
              <p className="leading-relaxed">
                💬 {recommendation.actionVerb} with {enrichedData.demonym} speaking {enrichedData.language}
              </p>
              {enrichedData.capital && (
                <p className="leading-relaxed">
                  🏛️ Their capital is {enrichedData.capital}
                </p>
              )}
              <p className="leading-relaxed">
                💰 Spend your money in {enrichedData.currency}
              </p>
            </div>
          )}

          {/* Cost breakdown table - TEMPORARILY HIDDEN (buggy, needs revisit) */}
          {/* <div className="border-t pt-3">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between hover:bg-muted/50 -mx-1 px-1 py-0.5 rounded transition-colors">
                <span>Flight:</span>
                <span className="font-medium">{currencySymbol}{cost.flight.toLocaleString()}</span>
              </div>
              <div className="flex justify-between hover:bg-muted/50 -mx-1 px-1 py-0.5 rounded transition-colors">
                <span>Hotel (per night):</span>
                <span className="font-medium">{currencySymbol}{cost.hotel.toLocaleString()}</span>
              </div>
              <div className="flex justify-between hover:bg-muted/50 -mx-1 px-1 py-0.5 rounded transition-colors">
                <span>Daily expenses:</span>
                <span className="font-medium">{currencySymbol}{cost.daily.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t mt-2">
                <span className="font-medium">7-day total:</span>
                <span className="font-bold text-accent text-base">
                  {currencySymbol}{cost.total.toLocaleString()}
                </span>
              </div>

              {enrichedData && (
                <div className="pt-1 text-xs text-muted-foreground">
                  Local currency: {enrichedData.currency}
                </div>
              )}
            </div>
          </div> */}
        </CardContent>
      </div>
    </Card>
  );
}
