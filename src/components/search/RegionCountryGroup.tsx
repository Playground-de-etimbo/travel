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

export const RegionCountryGroup = ({
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
      <h3 className="text-sm font-semibold mb-3 text-muted-foreground flex items-baseline gap-2">
        <span>{region}</span>
        <span className="text-xs font-normal">
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
};
