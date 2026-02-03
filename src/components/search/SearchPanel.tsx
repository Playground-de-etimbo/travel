import { useState, useRef } from 'react';
import { SearchBox } from './SearchBox';
import { TravelStatsBar } from './TravelStatsBar';
import { VisitedCountriesList } from './VisitedCountriesList';
import { Card } from '@/components/ui/card';
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
    <div className="hidden md:block relative z-30 -mt-48 py-8 space-y-6">
      {/* Desktop search box */}
      <SearchBox
        countries={countries}
        beenTo={beenTo}
        onAddCountry={handleAdd}
        searchInputRef={searchInputRef}
      />

      {/* Stats and countries container */}
      <div className="max-w-4xl mx-auto">
        <Card className="backdrop-blur-md bg-white/80 border border-white/20 shadow-lg">
          {/* Stats bar */}
          <div className="px-6 pt-6 pb-4">
            <TravelStatsBar beenTo={beenTo} totalCountries={countries.length} />
          </div>

          {/* Visited countries list */}
          <div className="px-6 pb-6">
            <VisitedCountriesList
              countries={countries}
              beenTo={beenTo}
              onRemoveCountry={handleRemove}
              recentlyAdded={recentlyAdded}
              searchInputRef={searchInputRef}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};
