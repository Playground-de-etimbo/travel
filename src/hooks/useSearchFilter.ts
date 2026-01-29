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
        keys: [
          { name: 'countryName', weight: 0.8 },
          { name: 'countryCode', weight: 0.15 },
          { name: 'region', weight: 0.05 },
        ],
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

    const resultsWithAdjustedScore = fuse.search(searchTerm).map(result => {
      const score = result.score ?? 1;
      const matches = result.matches ?? [];
      const nameMatch = matches.some(match => match.key === 'countryName');
      const codeMatch = matches.some(match => match.key === 'countryCode');
      const regionMatch = matches.some(match => match.key === 'region');
      const adjustedScore =
        score - (nameMatch ? 0.08 : 0) - (codeMatch ? 0.03 : 0) + (regionMatch ? 0.03 : 0);
      return { ...result, adjustedScore };
    });
    const results = resultsWithAdjustedScore
      .filter(result => result.adjustedScore <= scoreCutoff)
      .filter(result => {
        if (!isShortQuery) return true;
        const name = result.item.countryName.toLowerCase();
        const code = result.item.countryCode.toLowerCase();
        const nameParts = name.split(/[\s-]+/);
        const matchesNamePart = nameParts.some(part => part.startsWith(shortPrefix));
        return matchesNamePart || code.startsWith(normalizedTerm);
      });
    const sortedResults = [...results].sort((a, b) => {
      if (a.adjustedScore !== b.adjustedScore) {
        return a.adjustedScore - b.adjustedScore;
      }

      return a.item.countryName.localeCompare(b.item.countryName);
    });
    const grouped: Record<string, Country[]> = {};
    const flatResults: Country[] = [];
    const allMatches: FuseResultMatch[] = [];

    for (const result of sortedResults) {
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
