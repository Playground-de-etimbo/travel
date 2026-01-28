// Map color scheme - Sage Green palette

export const MAP_COLORS = {
  // Ocean/Sea background
  OCEAN: '#4A9FD8',

  // Unvisited countries
  UNVISITED: '#FAFCFA',
  UNVISITED_BORDER: '#CCCFD5',

  // Been To countries
  BEEN_TO: '#2FBF9B',
  BEEN_TO_BORDER: '#1F7A6B',

  // Hover state (grey)
  HOVER: '#E4EBE7',
  HOVER_BORDER: '#9CA3AF',

  // Hover state for visited countries (red - indicates removal)
  HOVER_REMOVE: '#E4EBE7',
  HOVER_REMOVE_BORDER: '#9CA3AF',

  // Add flash (brief highlight on add)
  ADD_FLASH: '#7ED6C6',
  ADD_FLASH_BORDER: '#2A9B88',

  // Coastline border (white outline for visual separation)
  COASTLINE: '#FFFFFF',

  // Tooltip - Add state (uses visited border color)
  TOOLTIP_ADD_BG: '#1F7A6B',
  TOOLTIP_ADD_TEXT: '#FFFFFF',

  // Tooltip - Remove state (white background)
  TOOLTIP_REMOVE_BG: '#991B1B',
  TOOLTIP_REMOVE_TEXT: '#FAFCFA',
} as const;

export function getCountryFill(countryCode: string, beenTo: string[]): string {
  return beenTo.includes(countryCode) ? MAP_COLORS.BEEN_TO : MAP_COLORS.UNVISITED;
}

export function getCountryStroke(countryCode: string, beenTo: string[]): string {
  return beenTo.includes(countryCode) ? MAP_COLORS.BEEN_TO_BORDER : MAP_COLORS.UNVISITED_BORDER;
}
