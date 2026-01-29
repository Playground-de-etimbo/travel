import { useMemo } from 'react';
import Fuse, { type FuseResultMatch } from 'fuse.js';
import type { Country } from '@/types';

interface UseSearchFilterOptions {
  countries: Country[];
  searchTerm: string;
  maxPerRegion?: number;
}

interface SearchResult {
  filteredResults: Record<string, Country[]>;
  matches: FuseResultMatch[];
}

export const useSearchFilter = ({
  countries,
  searchTerm,
  maxPerRegion = 5,
}: UseSearchFilterOptions): SearchResult => {
  const fuse = useMemo(
    () =>
      new Fuse(countries, {
        keys: ['countryName', 'countryCode', 'region'],
        threshold: 0.3,
        includeMatches: true,
      }),
    [countries]
  );

  return useMemo(() => {
    if (!searchTerm.trim()) {
      return { filteredResults: {}, matches: [] };
    }

    const results = fuse.search(searchTerm);
    const grouped: Record<string, Country[]> = {};
    const allMatches: FuseResultMatch[] = [];

    for (const result of results) {
      const country = result.item;
      const region = country.region;

      if (!grouped[region]) {
        grouped[region] = [];
      }

      if (grouped[region].length < maxPerRegion) {
        grouped[region].push(country);
        if (result.matches) {
          allMatches.push(...result.matches);
        }
      }
    }

    // Filter out empty regions
    const nonEmptyRegions = Object.fromEntries(
      Object.entries(grouped).filter(([_, countries]) => countries.length > 0)
    );

    return { filteredResults: nonEmptyRegions, matches: allMatches };
  }, [fuse, searchTerm, maxPerRegion]);
};
