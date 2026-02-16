import { useState, useRef, useCallback, memo } from 'react';
import { MobileSearchBox } from './MobileSearchBox';
import { TravelStatsBar } from './TravelStatsBar';
import { VisitedCountriesList } from './VisitedCountriesList';
import { useScrollExpansion } from '@/hooks/useScrollExpansion';
import type { Country } from '@/types';

interface MobileSearchPanelProps {
  beenTo: string[];
  countries: Country[];
  onAddCountry: (countryCode: string) => void;
  onRemoveCountry: (countryCode: string) => void;
}

export const MobileSearchPanel = memo(({
  beenTo,
  countries,
  onAddCountry,
  onRemoveCountry,
}: MobileSearchPanelProps) => {
  const [recentlyAdded, setRecentlyAdded] = useState<string | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Scroll expansion: 50vh → 80vh over 40vh scroll distance
  const { currentHeight } = useScrollExpansion({
    minHeight: 50,
    maxHeight: 80,
    expansionScrollRange: window.innerHeight * 0.4,
  });

  const handleAdd = useCallback(async (code: string) => {
    await onAddCountry(code);
    setRecentlyAdded(code);

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(25);
    }

    // Clear recently added after animation
    setTimeout(() => setRecentlyAdded(null), 600);
  }, [onAddCountry]);

  const handleRemove = useCallback(async (code: string) => {
    await onRemoveCountry(code);

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(25);
    }
  }, [onRemoveCountry]);

  // Only use dynamic expansion when there are many countries (>3)
  // For 1-3 countries, use natural content height with a reasonable max
  const shouldExpand = beenTo.length > 3;

  // When search is focused, pull panel up to 96vh to account for keyboard
  const focusedHeight = isSearchFocused ? 96 : currentHeight;

  return (
    <div className="md:hidden relative z-30 -mt-48 pb-8 px-2">
      {/* Sticky panel that expands with scroll only when there are many countries */}
      <div
        className="sticky bottom-0 bg-card text-card-foreground rounded-3xl shadow-2xl border-t border-border transition-all duration-200"
        style={{
          minHeight: shouldExpand ? `${focusedHeight}vh` : isSearchFocused ? '96vh' : 'auto',
          maxHeight: shouldExpand ? undefined : isSearchFocused ? '96vh' : '60vh',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div className="px-4 py-6 space-y-4">
          {/* Mobile Search Box */}
          <MobileSearchBox
            countries={countries}
            beenTo={beenTo}
            onAddCountry={handleAdd}
            searchInputRef={searchInputRef}
            onFocusChange={setIsSearchFocused}
          />

          {/* Travel Stats */}
          <TravelStatsBar beenTo={beenTo} totalCountries={countries.length} isMobile={true} />

          {/* Visited Countries List - Full list */}
          <VisitedCountriesList
            countries={countries}
            beenTo={beenTo}
            onRemoveCountry={handleRemove}
            recentlyAdded={recentlyAdded}
            searchInputRef={searchInputRef}
          />
        </div>
      </div>
    </div>
  );
});
