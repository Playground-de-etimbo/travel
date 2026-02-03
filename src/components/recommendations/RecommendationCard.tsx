import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { CountryRecommendation, BudgetTier } from '@/types/recommendation';
import type { Country } from '@/types/country';

interface RecommendationCardProps {
  recommendation: CountryRecommendation;
  country: Country;
  tier: BudgetTier;
}

export function RecommendationCard({
  recommendation,
  country,
  tier,
}: RecommendationCardProps) {
  const { imageUrl, reason, costs } = recommendation;
  const { countryName, flagEmoji } = country;
  const cost = costs[tier];
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Card className="overflow-hidden hover:shadow-lg hover:scale-[1.01] transition-all duration-300 recommendation-card border-border/50">
      <div className="flex flex-col md:flex-row">
        {/* Image section - always show gradient background */}
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
        </div>

        {/* Content section */}
        <CardContent className="md:w-3/5 p-5">
          <h3 className="text-lg font-bold mb-1.5 leading-tight">
            {flagEmoji} {countryName}
          </h3>
          <p className="text-sm text-muted-foreground/90 mb-3.5 line-clamp-2 leading-relaxed">
            {reason}
          </p>

          {/* Cost breakdown */}
          <div className="space-y-1 text-sm mb-4">
            <div className="flex justify-between">
              <span>Flight:</span>
              <span className="font-medium">${cost.flight.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Hotel (per night):</span>
              <span className="font-medium">${cost.hotel.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Daily expenses:</span>
              <span className="font-medium">${cost.daily.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-2 border-t font-bold">
              <span>7-day total:</span>
              <span className="text-accent">${cost.total.toLocaleString()}</span>
            </div>
          </div>

          {/* Placeholder action (non-functional) */}
          <Button variant="outline" className="w-full" disabled>
            Want To Go
          </Button>
        </CardContent>
      </div>
    </Card>
  );
}
