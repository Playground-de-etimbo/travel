import type { Country } from '@/types';
import { MAP_COLORS } from '@/lib/map/colors';

interface CountryTooltipProps {
  country: Country | null;
  position: { x: number; y: number };
  visible: boolean;
}

export function CountryTooltip({ country, position, visible }: CountryTooltipProps) {
  if (!country || !visible) {
    return null;
  }

  return (
    <div
      className="fixed pointer-events-none z-50 px-3 py-2 rounded-lg shadow-lg text-sm font-medium transition-opacity duration-150"
      style={{
        left: position.x + 15,
        top: position.y - 10,
        backgroundColor: MAP_COLORS.TOOLTIP_BG,
        color: MAP_COLORS.TOOLTIP_TEXT,
        opacity: visible ? 1 : 0,
      }}
    >
      <div className="flex items-center gap-2">
        <span className="text-2xl">{country.flagEmoji}</span>
        <span>{country.countryName}</span>
      </div>
    </div>
  );
}
