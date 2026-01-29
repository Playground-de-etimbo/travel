import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchBox } from './SearchBox';
import { TravelStatsBar } from './TravelStatsBar';
import { VisitedCountriesList } from './VisitedCountriesList';
import { MobileSearchOverlay } from './MobileSearchOverlay';
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
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [recentlyAdded, setRecentlyAdded] = useState<string | null>(null);

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
    <div className="relative z-30 -mt-48 py-8 space-y-6">
      {/* Mobile search button */}
      <div className="md:hidden max-w-5xl mx-auto px-6">
        <Button
          onClick={() => setMobileSearchOpen(true)}
          variant="outline"
          className="w-full justify-start gap-2 text-muted-foreground"
        >
          <Search className="h-4 w-4" />
          Search countries to add...
        </Button>
      </div>

      {/* Desktop search box */}
      <SearchBox countries={countries} beenTo={beenTo} onAddCountry={handleAdd} />

      {/* Countries added box */}
      <div
        className="max-w-5xl mx-auto"
      >
        {/* Stats */}
        <TravelStatsBar beenTo={beenTo} totalCountries={countries.length} />

        {/* Visited countries list */}
        <VisitedCountriesList
          countries={countries}
          beenTo={beenTo}
          onRemoveCountry={handleRemove}
          recentlyAdded={recentlyAdded}
        />
      </div>

      {/* Mobile search overlay */}
      <MobileSearchOverlay
        isOpen={mobileSearchOpen}
        countries={countries}
        beenTo={beenTo}
        onAddCountry={handleAdd}
        onClose={() => setMobileSearchOpen(false)}
      />
    </div>
  );
};
