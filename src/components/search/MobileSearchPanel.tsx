import { useState, useRef, useCallback, memo } from 'react';
import { MobileSearchBox } from './MobileSearchBox';
import { TravelStatsBar } from './TravelStatsBar';
import { VisitedCountriesList } from './VisitedCountriesList';
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
  const [, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className="md:hidden relative z-30 -mt-48 pb-8 px-2">
      <div
        className="bg-card text-card-foreground rounded-3xl shadow-2xl border-t border-border"
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
