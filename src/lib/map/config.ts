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
 * - countries-ultra-simplified.geo.json (666KB) - Ultra-simplified, 30% fewer coordinates [DEFAULT]
 * - countries-natural-earth-110m.geo.json (819KB) - Natural Earth simplified
 * - countries-natural-earth-50m.geo.json (2.9MB) - Natural Earth medium detail (MORE detailed)
 * - countries-110m.geo.json (819KB) - Original, moderate detail
 *
 * Not recommended:
 * - countries-minimalist.geo.json (636KB) - BROKEN: only shows one country
 * - countries-simple.geo.json (666KB) - BROKEN: only shows one country
 * - countries-datahub.geo.json (13.9MB) - Too large
 * - countries-world-atlas.geo.json - Missing ISO_A2 property
 * - countries-rsm.geo.json - Placeholder/empty file
 *
 * To test alternatives without code changes:
 * VITE_MAP_GEOJSON_URL=/data/countries-natural-earth-110m.geo.json pnpm dev
 */

export const MAP_CONFIG = {
  /**
   * GeoJSON URL for map rendering
   *
   * Default: countries-ultra-simplified.geo.json (simplified 30% from Natural Earth 110m)
   * Override via environment variable: VITE_MAP_GEOJSON_URL
   *
   * Example: VITE_MAP_GEOJSON_URL=/data/countries-natural-earth-110m.geo.json pnpm dev
   */
  geoJsonUrl: import.meta.env.VITE_MAP_GEOJSON_URL || '/data/countries-natural-earth-110m.geo.json',
} as const;
