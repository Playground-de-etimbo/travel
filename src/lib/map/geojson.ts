import { geoCentroid, geoBounds } from 'd3-geo';
import type { FeatureCollection, Geometry } from 'geojson';

export async function loadCountryBoundaries(): Promise<FeatureCollection> {
  const response = await fetch('/data/countries.geo.json');
  if (!response.ok) {
    throw new Error('Failed to load country boundaries');
  }
  return response.json();
}

/**
 * Calculate the centroid (center point) of a country's geometry
 * Returns [longitude, latitude]
 */
export function getCountryCentroid(geometry: Geometry): [number, number] {
  const centroid = geoCentroid({ type: 'Feature', geometry, properties: {} });
  return centroid;
}

/**
 * Calculate bounding box of a country's geometry
 * Returns [[minLon, minLat], [maxLon, maxLat]]
 */
export function getCountryBounds(geometry: Geometry): [[number, number], [number, number]] {
  return geoBounds({ type: 'Feature', geometry, properties: {} });
}

/**
 * Check if a point is visible in the current viewport
 * viewport: { center: [lon, lat], zoom: number, width: number, height: number }
 */
export function isPointVisible(
  point: [number, number],
  viewport: { center: [number, number]; zoom: number; width: number; height: number }
): boolean {
  // Approximate calculation - simpler approach for MVP
  // Calculate rough viewport bounds based on zoom level
  const zoomFactor = 360 / (256 * Math.pow(2, viewport.zoom));
  const viewportWidth = viewport.width * zoomFactor;
  const viewportHeight = viewport.height * zoomFactor;

  const [centerLon, centerLat] = viewport.center;
  const [pointLon, pointLat] = point;

  const lonDiff = Math.abs(pointLon - centerLon);
  const latDiff = Math.abs(pointLat - centerLat);

  return lonDiff < viewportWidth / 2 && latDiff < viewportHeight / 2;
}
