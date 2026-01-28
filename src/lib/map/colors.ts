// Map color scheme - Sage Green palette

export const MAP_COLORS = {
  // Ocean/Sea background
  OCEAN: '#4A9FD8',

  // Unvisited countries
  UNVISITED: '#FAFCFA',
  UNVISITED_BORDER: '#CCCFD5',

  // Been To countries (light sage)
  BEEN_TO: '#6FBFB2',
  BEEN_TO_BORDER: '#1F7A6B',

  // Hover state (grey)
  HOVER: '#E5E7EB',
  HOVER_BORDER: '#9CA3AF',

  // Hover state for visited countries (red - indicates removal)
  HOVER_REMOVE: '#EF4444',
  HOVER_REMOVE_BORDER: '#991B1B',

  // Coastline border (white outline for visual separation)
  COASTLINE: '#FFFFFF',

  // Tooltip - Add state (uses visited border color)
  TOOLTIP_ADD_BG: '#1F7A6B',
  TOOLTIP_ADD_TEXT: '#FFFFFF',

  // Tooltip - Remove state (white background)
  TOOLTIP_REMOVE_BG: '#FFFFFF',
  TOOLTIP_REMOVE_TEXT: '#1F2937',
} as const;

export function getCountryFill(countryCode: string, beenTo: string[]): string {
  return beenTo.includes(countryCode) ? MAP_COLORS.BEEN_TO : MAP_COLORS.UNVISITED;
}

export function getCountryStroke(countryCode: string, beenTo: string[]): string {
  return beenTo.includes(countryCode) ? MAP_COLORS.BEEN_TO_BORDER : MAP_COLORS.UNVISITED_BORDER;
}
