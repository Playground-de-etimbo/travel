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
    TRANSLATE_EXTENT: {
      MIN: [-300, -200] as [number, number],
      MAX: [900, 600] as [number, number],
    },
  },
} as const;
