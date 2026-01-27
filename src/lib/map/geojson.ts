import type { FeatureCollection } from 'geojson';

export async function loadCountryBoundaries(): Promise<FeatureCollection> {
  const response = await fetch('/data/countries.geo.json');
  if (!response.ok) {
    throw new Error('Failed to load country boundaries');
  }
  return response.json();
}
