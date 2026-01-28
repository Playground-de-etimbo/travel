import colors from 'tailwindcss/colors';

/**
 * Map Color Palette - Using Tailwind's built-in colors
 * Colors are in OKLch format (Tailwind v4)
 */
export const MAP_COLORS = {
  // Ocean/Sea background - bright blue
  OCEAN: colors.sky['400'],

  // Unvisited countries
  UNVISITED: colors.gray['50'],
  UNVISITED_BORDER: colors.gray['300'],

  // Been To countries - teal theme
  BEEN_TO: colors.teal['500'],
  BEEN_TO_BORDER: colors.teal['700'],

  // Hover state (grey)
  HOVER: colors.gray['100'],
  HOVER_BORDER: colors.gray['400'],

  // Hover state for visited countries (indicates removal)
  HOVER_REMOVE: colors.gray['100'],
  HOVER_REMOVE_BORDER: colors.gray['400'],

  // Add flash (brief highlight on add)
  ADD_FLASH: colors.teal['300'],
  ADD_FLASH_BORDER: colors.teal['600'],

  // Coastline border
  COASTLINE: colors.white,

  // Tooltip - Add state
  TOOLTIP_ADD_BG: colors.teal['700'],
  TOOLTIP_ADD_TEXT: colors.white,

  // Tooltip - Remove state
  TOOLTIP_REMOVE_BG: colors.red['700'],
  TOOLTIP_REMOVE_TEXT: colors.gray['50'],
} as const;

export function getCountryFill(countryCode: string, beenTo: string[]): string {
  return beenTo.includes(countryCode) ? MAP_COLORS.BEEN_TO : MAP_COLORS.UNVISITED;
}

export function getCountryStroke(countryCode: string, beenTo: string[]): string {
  return beenTo.includes(countryCode) ? MAP_COLORS.BEEN_TO_BORDER : MAP_COLORS.UNVISITED_BORDER;
}
