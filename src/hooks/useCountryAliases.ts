import { useState, useEffect } from 'react';

type CountryAliases = Record<string, string[]>;

export const useCountryAliases = (): CountryAliases => {
  const [aliases, setAliases] = useState<CountryAliases>({});

  useEffect(() => {
    fetch('/data/country-aliases.json')
      .then((res) => {
        if (!res.ok) return {};
        return res.json();
      })
      .then((data) => setAliases(data))
      .catch(() => {});
  }, []);

  return aliases;
};
