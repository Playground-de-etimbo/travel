/**
 * Map Configuration
 *
 * Central configuration for the WorldMap component.
 * Supports environment variable overrides for easy testing.
 */

/**
 * Available GeoJSON files in public/data/:
 *
 * Active production file:
 * - countries-natural-earth-110m.geo.json (~0.6MB) - Natural Earth 110m admin_0_map_units
 *
 * Larger alternates are archived outside public/ to keep production bundles small.
 *
 * To test alternatives without code changes:
 * VITE_MAP_GEOJSON_URL=/data/countries-natural-earth-110m.geo.json pnpm dev
 */

export const MAP_CONFIG = {
  /**
   * GeoJSON URL for map rendering
   *
   * Default: countries-natural-earth-110m.geo.json (~0.6MB, lower detail, includes territories)
   * Override via environment variable: VITE_MAP_GEOJSON_URL
   *
   * Example: VITE_MAP_GEOJSON_URL=/data/countries-natural-earth-110m.geo.json pnpm dev
   */
  geoJsonUrl: import.meta.env.VITE_MAP_GEOJSON_URL || '/data/countries-natural-earth-110m.geo.json',
} as const;
