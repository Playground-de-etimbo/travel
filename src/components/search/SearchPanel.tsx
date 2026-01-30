import { useState, useRef } from 'react';
import { SearchBox } from './SearchBox';
import { TravelStatsBar } from './TravelStatsBar';
import { VisitedCountriesList } from './VisitedCountriesList';
import type { Country } from '@/types';

interface SearchPanelProps {
  beenTo: string[];
  countries: Country[];
  onAddCountry: (countryCode: string) => void;
  onRemoveCountry: (countryCode: string) => void;
}

export const SearchPanel = ({
  beenTo,
  countries,
  onAddCountry,
  onRemoveCountry,
}: SearchPanelProps) => {
  const [recentlyAdded, setRecentlyAdded] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleAdd = async (code: string) => {
    await onAddCountry(code);
    setRecentlyAdded(code);

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(25);
    }

    // Clear recently added after animation
    setTimeout(() => setRecentlyAdded(null), 600);
  };

  const handleRemove = async (code: string) => {
    await onRemoveCountry(code);

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(25);
    }
  };

  return (
    <div className="hidden md:block relative z-30 -mt-48 py-8 space-y-3">
      {/* Desktop search box */}
      <SearchBox
        countries={countries}
        beenTo={beenTo}
        onAddCountry={handleAdd}
        searchInputRef={searchInputRef}
      />

      {/* Stats card - directly below search */}
      <TravelStatsBar beenTo={beenTo} totalCountries={countries.length} />

      {/* Countries added box */}
      <div className="max-w-5xl mx-auto">
        {/* Visited countries list */}
        <VisitedCountriesList
          countries={countries}
          beenTo={beenTo}
          onRemoveCountry={handleRemove}
          recentlyAdded={recentlyAdded}
          searchInputRef={searchInputRef}
        />
      </div>
    </div>
  );
};
