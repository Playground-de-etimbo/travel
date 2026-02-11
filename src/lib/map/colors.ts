/**
 * Map Color Palette - Theme-aware colors using CSS custom properties
 * Colors automatically adapt to light/dark mode via CSS variables in index.css
 */
export const MAP_COLORS = {
  // Ocean/Sea background - adapts to theme
  OCEAN: 'var(--map-ocean)',

  // Unvisited countries
  UNVISITED: 'var(--map-unvisited)',
  UNVISITED_BORDER: 'var(--map-unvisited-border)',

  // Been To countries - teal theme
  BEEN_TO: 'var(--map-been-to)',
  BEEN_TO_BORDER: 'var(--map-been-to-border)',

  // Hover state
  HOVER: 'var(--map-hover)',
  HOVER_BORDER: 'var(--map-hover-border)',

  // Hover state for visited countries (indicates removal)
  HOVER_REMOVE: 'var(--map-hover)',
  HOVER_REMOVE_BORDER: 'var(--map-hover-border)',

  // Add flash (brief highlight on add) - use brighter teal
  ADD_FLASH: 'oklch(71% 0.16 191)',
  ADD_FLASH_BORDER: 'var(--map-been-to-border)',

  // Coastline border
  COASTLINE: 'var(--map-coastline)',

  // Spotlight effect for pan animation
  SPOTLIGHT: 'var(--map-spotlight)',

  // Tooltip - Add state (teal theme)
  TOOLTIP_ADD_BG: 'oklch(48% 0.13 191)',
  TOOLTIP_ADD_TEXT: 'oklch(100% 0 0)',

  // Tooltip - Remove state (red theme)
  TOOLTIP_REMOVE_BG: 'oklch(55% 0.22 25)',
  TOOLTIP_REMOVE_TEXT: 'oklch(98% 0.01 230)',
} as const;

export function getCountryFill(countryCode: string, beenTo: string[]): string {
  return beenTo.includes(countryCode) ? MAP_COLORS.BEEN_TO : MAP_COLORS.UNVISITED;
}

export function getCountryStroke(countryCode: string, beenTo: string[]): string {
  return beenTo.includes(countryCode) ? MAP_COLORS.BEEN_TO_BORDER : MAP_COLORS.UNVISITED_BORDER;
}
