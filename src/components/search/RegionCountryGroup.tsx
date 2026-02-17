import { memo } from 'react';
import { CountryChip } from './CountryChip';
import type { Country } from '@/types';

interface RegionCountryGroupProps {
  region: string;
  countries: Country[];
  totalInRegion: number;
  visitedCount: number;
  onRemoveCountry: (countryCode: string) => void;
  recentlyAdded: string | null;
}

export const RegionCountryGroup = memo(({
  region,
  countries,
  totalInRegion,
  visitedCount,
  onRemoveCountry,
  recentlyAdded,
}: RegionCountryGroupProps) => {
  const percentage = totalInRegion > 0 ? (visitedCount / totalInRegion) * 100 : 0;

  return (
    <div>
      <h3 className="text-xs font-semibold mb-2.5 text-muted-foreground uppercase tracking-wider flex items-baseline gap-2">
        <span>{region}</span>
        <span className="text-[10px] font-normal opacity-80">
          {visitedCount}/{totalInRegion} countries ({percentage.toFixed(1)}%)
        </span>
      </h3>
      <div className="flex flex-wrap gap-2">
        {countries.map((country, index) => (
          <CountryChip
            key={country.countryCode}
            country={country}
            onRemove={onRemoveCountry}
            animationDelay={index * 30}
            isRecentlyAdded={country.countryCode === recentlyAdded}
          />
        ))}
      </div>
    </div>
  );
});
