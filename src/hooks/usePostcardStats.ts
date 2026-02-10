import { useMemo, useState, useEffect } from 'react';
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

export const usePostcardStats = (
  countries: Country[],
  beenTo: string[],
): PostcardStats => {
  const [languages, setLanguages] = useState<string[]>([]);
  const [currencies, setCurrencies] = useState<string[]>([]);

  // Fetch enriched data (languages) for visited countries
  useEffect(() => {
    if (beenTo.length === 0) {
      setLanguages([]);
      setCurrencies([]);
      return;
    }

    let cancelled = false;

    const fetchLanguages = async () => {
      const langSet = new Set<string>();
      const currSet = new Set<string>();

      await Promise.all(
        beenTo.map(async (code) => {
          const data = await fetchCountryEnrichedData(code);
          if (data && !cancelled) {
            if (data.language && data.language !== 'who knows what') {
              langSet.add(data.language);
            }
            if (data.currency) {
              currSet.add(data.currency);
            }
          }
        }),
      );

      if (!cancelled) {
        setLanguages([...langSet].sort());
        setCurrencies([...currSet].sort());
      }
    };

    fetchLanguages();
    return () => { cancelled = true; };
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
