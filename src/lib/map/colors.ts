// Map color scheme - Sage Green palette

export const MAP_COLORS = {
  // Ocean/Sea background
  OCEAN: '#4A9FD8',

  // Unvisited countries
  UNVISITED: '#F6FCFE',
  UNVISITED_BORDER: '#E6EFF6',

  // Been To countries (light sage)
  BEEN_TO: '#D5E5D5',
  BEEN_TO_BORDER: '#A8C9A8',

  // Hover state (grey)
  HOVER: '#E5E7EB',
  HOVER_BORDER: '#9CA3AF',

  // Tooltip
  TOOLTIP_BG: 'rgba(90, 122, 90, 0.95)',
  TOOLTIP_TEXT: '#FFFFFF',
} as const;

export function getCountryFill(countryCode: string, beenTo: string[]): string {
  return beenTo.includes(countryCode) ? MAP_COLORS.BEEN_TO : MAP_COLORS.UNVISITED;
}

export function getCountryStroke(countryCode: string, beenTo: string[]): string {
  return beenTo.includes(countryCode) ? MAP_COLORS.BEEN_TO_BORDER : MAP_COLORS.UNVISITED_BORDER;
}
