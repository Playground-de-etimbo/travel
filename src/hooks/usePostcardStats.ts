import { useMemo, useState, useEffect, useRef } from 'react';
import type { Country } from '@/types/country';
import { fetchCountryEnrichedData } from '@/lib/api/restCountries';

const ALL_REGIONS = [
  'Africa',
  'Antarctica',
  'Asia',
  'Europe',
  'North America',
  'Oceania',
  'South America',
];

interface PostcardStats {
  visitedCount: number;
  totalCountries: number;
  percentExplored: number;
  regionsVisited: string[];
  regionCount: number;
  totalRegions: number;
  visitedCountries: Country[];
  flagEmojis: string[];
  uniqueLanguages: string[];
  languageCount: number;
  currenciesUsed: string[];
  currencyCount: number;
}

interface EnrichedEntry {
  language: string | null;
  currency: string | null;
}

export const usePostcardStats = (
  countries: Country[],
  beenTo: string[],
): PostcardStats => {
  const [languages, setLanguages] = useState<string[]>([]);
  const [currencies, setCurrencies] = useState<string[]>([]);

  // Track previously fetched codes to only fetch the delta
  const fetchedRef = useRef<Map<string, EnrichedEntry>>(new Map());

  // Fetch enriched data only for newly added countries
  useEffect(() => {
    if (beenTo.length === 0) {
      setLanguages([]);
      setCurrencies([]);
      fetchedRef.current.clear();
      return;
    }

    // Remove codes no longer in beenTo
    const beenToSet = new Set(beenTo);
    for (const code of fetchedRef.current.keys()) {
      if (!beenToSet.has(code)) fetchedRef.current.delete(code);
    }

    // Find codes not yet fetched
    const newCodes = beenTo.filter(code => !fetchedRef.current.has(code));

    if (newCodes.length === 0) {
      // Rebuild from cache (handles removals)
      rebuildFromCache();
      return;
    }

    let cancelled = false;

    const fetchNewCodes = async () => {
      await Promise.all(
        newCodes.map(async (code) => {
          const data = await fetchCountryEnrichedData(code);
          if (!cancelled && data) {
            fetchedRef.current.set(code, {
              language: data.language && data.language !== 'who knows what' ? data.language : null,
              currency: data.currency ?? null,
            });
          }
        }),
      );

      if (!cancelled) {
        rebuildFromCache();
      }
    };

    fetchNewCodes();
    return () => { cancelled = true; };

    function rebuildFromCache() {
      const langSet = new Set<string>();
      const currSet = new Set<string>();
      for (const code of beenTo) {
        const entry = fetchedRef.current.get(code);
        if (entry?.language) langSet.add(entry.language);
        if (entry?.currency) currSet.add(entry.currency);
      }
      setLanguages([...langSet].sort());
      setCurrencies([...currSet].sort());
    }
  }, [beenTo]);

  return useMemo(() => {
    const beenToSet = new Set(beenTo);
    const visitedCountries = countries.filter((c) =>
      beenToSet.has(c.countryCode),
    );
    const regionsVisited = [
      ...new Set(visitedCountries.map((c) => c.continent)),
    ];
    const totalCountries = countries.length;
    const visitedCount = visitedCountries.length;
    const percentExplored =
      totalCountries > 0 ? (visitedCount / totalCountries) * 100 : 0;

    return {
      visitedCount,
      totalCountries,
      percentExplored,
      regionsVisited,
      regionCount: regionsVisited.length,
      totalRegions: ALL_REGIONS.length,
      visitedCountries,
      flagEmojis: visitedCountries.map((c) => c.flagEmoji),
      uniqueLanguages: languages,
      languageCount: languages.length,
      currenciesUsed: currencies,
      currencyCount: currencies.length,
    };
  }, [countries, beenTo, languages, currencies]);
};
