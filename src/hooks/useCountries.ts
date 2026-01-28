import { useState, useEffect } from 'react';
import type { Country } from '@/types';

export function useCountries() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch('/data/countries.json')
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to load countries: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setCountries(data);
        setError(null);
      })
      .catch(err => {
        console.error('Failed to load countries:', err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { countries, loading, error };
}
