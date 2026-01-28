import type { Country } from '@/types';
import { MAP_COLORS } from '@/lib/map/colors';

interface CountryTooltipProps {
  country: Country | null;
  position: { x: number; y: number };
  visible: boolean;
  isVisited?: boolean;
}

export function CountryTooltip({ country, position, visible, isVisited = false }: CountryTooltipProps) {
  if (!country || !visible) {
    return null;
  }

  const bgColor = isVisited ? MAP_COLORS.TOOLTIP_REMOVE_BG : MAP_COLORS.TOOLTIP_ADD_BG;
  const textColor = isVisited ? MAP_COLORS.TOOLTIP_REMOVE_TEXT : MAP_COLORS.TOOLTIP_ADD_TEXT;

  return (
    <div
      className="fixed pointer-events-none z-50 px-3 py-2 rounded-lg shadow-lg text-sm font-medium transition-opacity duration-150"
      style={{
        left: position.x + 15,
        top: position.y - 10,
        backgroundColor: bgColor,
        color: textColor,
        opacity: visible ? 1 : 0,
      }}
    >
      <div className="flex items-center gap-2">
        <span className="text-2xl">{country.flagEmoji}</span>
        <span className="flex items-center gap-1.5">
          {isVisited ? (
            <>
              <span className="text-base">×</span>
              <span>Remove {country.countryName}</span>
            </>
          ) : (
            <>
              <span className="text-base">+</span>
              <span>Add {country.countryName}</span>
            </>
          )}
        </span>
      </div>
    </div>
  );
}
