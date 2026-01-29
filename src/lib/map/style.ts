/**
 * Map Styling Configuration
 *
 * Non-color styling values for the WorldMap component.
 * Separated from colors.ts to maintain single responsibility.
 */

export const MAP_STYLE = {
  /**
   * Border widths for map elements
   */
  BORDER: {
    // White coastline border (outer layer)
    COASTLINE: 4.0,

    // Country borders (inner layer)
    DEFAULT: 0.6,
    HOVER: 0.6,
  },

  /**
   * Zoom configuration
   */
  ZOOM: {
    MIN: 1,
    MAX: 4,
    INITIAL: 1,
  },

  /**
   * Projection configuration
   */
  PROJECTION: {
    SCALE: 200,
    ROTATE: [-147, 0, 0] as [number, number, number], // Rotate globe: Europe/Africa left, Asia center, Americas right
    TRANSLATE_EXTENT: {
      MIN: [-200, -300] as [number, number], // Limit panning to visible continents
      MAX: [1000, 700] as [number, number],   // Prevent panning into empty space
    },
  },
} as const;
