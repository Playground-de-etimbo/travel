/**
 * Map Configuration
 *
 * Central configuration for the WorldMap component.
 * Supports environment variable overrides for easy testing.
 */

/**
 * Available GeoJSON files in public/data/:
 *
 * Recommended options:
 * - countries-natural-earth-50m.geo.json (2.9MB) - Natural Earth medium detail, SMOOTH borders [DEFAULT]
 * - countries-natural-earth-110m.geo.json (819KB) - Natural Earth low detail, jagged borders (lighter weight)
 *
 * Not recommended (broken or unsuitable):
 * - countries-minimalist.geo.json (636KB) - BROKEN: Only renders one country
 * - countries-ultra-simplified.geo.json (666KB) - BROKEN: 14 null geometries (Fiji, Bahamas, etc.)
 * - countries-simple.geo.json (666KB) - BROKEN: 14 null geometries (same issue)
 * - countries-datahub.geo.json (13.9MB) - Too large
 * - countries-world-atlas.geo.json (105KB) - Missing ISO_A2 property
 * - countries-rsm.geo.json (64B) - Placeholder/empty file
 *
 * To test alternatives without code changes:
 * VITE_MAP_GEOJSON_URL=/data/countries-natural-earth-110m.geo.json pnpm dev
 */

export const MAP_CONFIG = {
  /**
   * GeoJSON URL for map rendering
   *
   * Default: countries-natural-earth-50m.geo.json (2.9MB, medium detail, smooth borders)
   * Override via environment variable: VITE_MAP_GEOJSON_URL
   *
   * Example: VITE_MAP_GEOJSON_URL=/data/countries-natural-earth-110m.geo.json pnpm dev
   */
  geoJsonUrl: import.meta.env.VITE_MAP_GEOJSON_URL || '/data/countries-natural-earth-50m.geo.json',
} as const;
