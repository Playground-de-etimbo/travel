import { Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function SampleResults() {
  const sampleCountries = [
    { flag: '🇯🇵', name: 'Japan', reason: 'Perfect blend of ancient temples and modern innovation' },
    { flag: '🇮🇹', name: 'Italy', reason: 'Renaissance art, incredible cuisine, and stunning coastlines' },
    { flag: '🇹🇭', name: 'Thailand', reason: 'Tropical paradise with vibrant culture and friendly locals' },
  ];

  return (
    <div className="space-y-4">
      {/* Fun note - more compact */}
      <div className="bg-accent/10 border-2 border-accent/30 rounded-lg p-4 flex items-start gap-3">
        <Sparkles className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-base mb-1">
            ✨ Sample destinations
          </h3>
          <p className="text-xs text-muted-foreground">
            Fill out your preferences above for personalized recommendations! 🌍
          </p>
        </div>
      </div>

      {/* Sample cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sampleCountries.map((country) => (
          <Card key={country.name} className="overflow-hidden opacity-60">
            <div className="flex flex-col md:flex-row">
              {/* Image placeholder with flag - more compact */}
              <div className="md:w-2/5 h-32 md:h-auto relative bg-gradient-to-br from-accent/20 to-primary/20">
                <div className="absolute inset-0 flex items-center justify-center text-5xl">
                  {country.flag}
                </div>
              </div>

              {/* Content - more compact */}
              <CardContent className="md:w-3/5 p-4">
                <h3 className="text-lg font-bold mb-1">
                  {country.flag} {country.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {country.reason}
                </p>

                {/* Placeholder costs - more compact */}
                <div className="space-y-0.5 text-xs opacity-50">
                  <div className="flex justify-between">
                    <span>Flight:</span>
                    <span className="font-medium">$800</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hotel/night:</span>
                    <span className="font-medium">$120</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Daily:</span>
                    <span className="font-medium">$80</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t font-bold text-sm">
                    <span>7-day:</span>
                    <span className="text-accent">$2,200</span>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
