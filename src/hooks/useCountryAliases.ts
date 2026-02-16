import { useState, useEffect } from 'react';

type CountryAliases = Record<string, string[]>;

// Module-level cache: single fetch shared across all hook instances
let cachedAliases: CountryAliases | null = null;
let fetchPromise: Promise<CountryAliases> | null = null;

const loadAliases = (): Promise<CountryAliases> => {
  if (cachedAliases) return Promise.resolve(cachedAliases);
  if (!fetchPromise) {
    fetchPromise = fetch('/data/country-aliases.json')
      .then((res) => {
        if (!res.ok) return {};
        return res.json();
      })
      .then((data: CountryAliases) => {
        cachedAliases = data;
        return data;
      })
      .catch(() => {
        fetchPromise = null; // Allow retry on failure
        return {} as CountryAliases;
      });
  }
  return fetchPromise;
};

export const useCountryAliases = (): CountryAliases => {
  const [aliases, setAliases] = useState<CountryAliases>(cachedAliases ?? {});

  useEffect(() => {
    if (cachedAliases) {
      setAliases(cachedAliases);
      return;
    }
    loadAliases().then(setAliases);
  }, []);

  return aliases;
};
