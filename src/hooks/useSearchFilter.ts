import { useMemo } from 'react';
import Fuse, { type FuseResultMatch } from 'fuse.js';
import type { Country } from '@/types';

interface UseSearchFilterOptions {
  countries: Country[];
  searchTerm: string;
}

interface SearchResult {
  filteredResults: Record<string, Country[]>;
  matches: FuseResultMatch[];
  flatResults: Country[];
}

export const useSearchFilter = ({
  countries,
  searchTerm,
}: UseSearchFilterOptions): SearchResult => {
  const minMatchCharLength = 3;
  const scoreCutoff = 0.32;
  const fuse = useMemo(
    () =>
      new Fuse(countries, {
        keys: ['countryName', 'countryCode', 'region'],
        threshold: 0.3,
        minMatchCharLength,
        includeMatches: true,
        includeScore: true,
      }),
    [countries, minMatchCharLength]
  );

  return useMemo(() => {
    if (!searchTerm.trim()) {
      return { filteredResults: {}, matches: [], flatResults: [] };
    }

    const normalizedTerm = searchTerm.trim().toLowerCase();
    const isShortQuery = normalizedTerm.length <= 4;
    const shortPrefix = normalizedTerm.slice(0, 3);

    const results = fuse
      .search(searchTerm)
      .filter(result => (result.score ?? 1) <= scoreCutoff)
      .filter(result => {
        if (!isShortQuery) return true;
        const name = result.item.countryName.toLowerCase();
        const code = result.item.countryCode.toLowerCase();
        return name.startsWith(shortPrefix) || code.startsWith(normalizedTerm);
      });
    const grouped: Record<string, Country[]> = {};
    const flatResults: Country[] = [];
    const allMatches: FuseResultMatch[] = [];

    for (const result of results) {
      const country = result.item;
      const region = country.region;

      if (!grouped[region]) {
        grouped[region] = [];
      }

      grouped[region].push(country);
      flatResults.push(country);
      if (result.matches) {
        allMatches.push(...result.matches);
      }
    }

    // Filter out empty regions
    const nonEmptyRegions = Object.fromEntries(
      Object.entries(grouped).filter(([_, countries]) => countries.length > 0)
    );

    return { filteredResults: nonEmptyRegions, matches: allMatches, flatResults };
  }, [fuse, searchTerm]);
};
