import { useMemo } from 'react';
import { RegionCountryGroup } from './RegionCountryGroup';
import type { Country } from '@/types';

interface VisitedCountriesListProps {
  countries: Country[];
  beenTo: string[];
  onRemoveCountry: (countryCode: string) => void;
  recentlyAdded: string | null;
  searchInputRef?: React.RefObject<HTMLInputElement>;
}

export const VisitedCountriesList = ({
  countries,
  beenTo,
  onRemoveCountry,
  recentlyAdded,
  searchInputRef,
}: VisitedCountriesListProps) => {
  const groupedCountries = useMemo(() => {
    // Filter to visited countries
    const visitedCountries = countries.filter((c) => beenTo.includes(c.countryCode));

    // Group by region
    const grouped = visitedCountries.reduce(
      (acc, country) => {
        if (!acc[country.region]) {
          acc[country.region] = [];
        }
        acc[country.region].push(country);
        return acc;
      },
      {} as Record<string, Country[]>
    );

    // Calculate total countries per region (from all countries, not just visited)
    const regionTotals = countries.reduce(
      (acc, country) => {
        acc[country.region] = (acc[country.region] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Sort regions by visited count (descending)
    const sortedRegions = Object.entries(grouped).sort(
      ([, aCountries], [, bCountries]) => bCountries.length - aCountries.length
    );

    return sortedRegions.map(([region, regionCountries]) => ({
      region,
      countries: regionCountries,
      visitedCount: regionCountries.length,
      totalInRegion: regionTotals[region] || 0,
    }));
  }, [countries, beenTo]);

  const handleStartExploring = () => {
    searchInputRef?.current?.focus();
    searchInputRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Add extra scroll offset to pull panel up more (reduce gap at top)
    setTimeout(() => {
      window.scrollBy({ top: -280, behavior: 'smooth' });
    }, 300);
  };

  if (beenTo.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>
          You have not told us where you have been yet.{' '}
          <button
            type="button"
            onClick={handleStartExploring}
            className="text-accent font-semibold underline decoration-2 underline-offset-4 hover:opacity-80 transition-opacity"
          >
            Start exploring
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {groupedCountries.map(({ region, countries, visitedCount, totalInRegion }) => (
        <RegionCountryGroup
          key={region}
          region={region}
          countries={countries}
          totalInRegion={totalInRegion}
          visitedCount={visitedCount}
          onRemoveCountry={onRemoveCountry}
          recentlyAdded={recentlyAdded}
        />
      ))}
    </div>
  );
};
