import { useState, useRef, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import { AutocompleteDropdown } from './AutocompleteDropdown';
import { useSearchFilter } from '@/hooks/useSearchFilter';
import { useAutocomplete } from '@/hooks/useAutocomplete';
import { playCountrySound } from '@/lib/sound/countrySounds';
import type { Country } from '@/types';

interface SearchBoxProps {
  countries: Country[];
  beenTo: string[];
  onAddCountry: (countryCode: string) => void;
}

export const SearchBox = ({ countries, beenTo, onAddCountry }: SearchBoxProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [toastLabel, setToastLabel] = useState<string | null>(null);
  const [showPostAddMessage, setShowPostAddMessage] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const clearTimeoutRef = useRef<NodeJS.Timeout>();
  const toastTimeoutRef = useRef<number | null>(null);

  const { flatResults } = useSearchFilter({
    countries,
    searchTerm,
  });

  const hasResults = flatResults.length > 0;

  const handleSelect = (countryCode: string) => {
    const selectedCountry = countries.find(country => country.countryCode === countryCode);
    if (selectedCountry) {
      setToastLabel(`Added ${selectedCountry.countryName}`);
    }
    setShowPostAddMessage(true);
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastLabel(null);
    }, 1600);
    void playCountrySound('add');
    onAddCountry(countryCode);
    setIsDropdownOpen(false);
    setSearchTerm('');
    inputRef.current?.focus();

    // Clear input after 300ms delay
    clearTimeoutRef.current = setTimeout(() => {
      setSearchTerm('');
      inputRef.current?.focus();
    }, 300);
  };

  const handleClose = () => {
    setIsDropdownOpen(false);
  };

  const { handleKeyDown, selectableItems, selectedIndex, setSelectedIndex, scrollToItem } =
    useAutocomplete({
      results: flatResults,
      onSelect: handleSelect,
      onClose: handleClose,
    });

  // Open dropdown when typing starts
  useEffect(() => {
    if (searchTerm.trim()) {
      setIsDropdownOpen(true);
      setSelectedIndex(0);
      setShowPostAddMessage(false);
    } else {
      setIsDropdownOpen(false);
    }
  }, [searchTerm, setSelectedIndex]);

  // Scroll to selected item
  useEffect(() => {
    if (isDropdownOpen && selectedIndex >= 0) {
      scrollToItem(selectedIndex);
    }
  }, [selectedIndex, isDropdownOpen, scrollToItem]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (clearTimeoutRef.current) {
        clearTimeout(clearTimeoutRef.current);
      }
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = () => {
    if (selectableItems.length > 0 && selectableItems[selectedIndex]) {
      handleSelect(selectableItems[selectedIndex].country.countryCode);
    }
  };

  const handleAddTopResult = () => {
    const topCountry = flatResults[0];
    if (!topCountry || beenTo.includes(topCountry.countryCode)) return;
    setToastLabel(`Added ${topCountry.countryName}`);
    setShowPostAddMessage(true);
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastLabel(null);
    }, 1600);
    void playCountrySound('add');
    onAddCountry(topCountry.countryCode);
    setSearchTerm('');
    inputRef.current?.focus();
    setTimeout(() => setIsDropdownOpen(false), 300);
    setTimeout(() => inputRef.current?.focus(), 320);
  };

  const isTopResultAdded = useMemo(() => {
    const topCountry = flatResults[0];
    if (!topCountry) return true;
    return beenTo.includes(topCountry.countryCode);
  }, [flatResults, beenTo]);

  const countryCountLabel = beenTo.length === 1 ? 'country' : 'countries';

  return (
    <div className="relative hidden md:block max-w-4xl mx-auto mb-8">
      {toastLabel && (
        <div className="map-toast map-toast--add max-w-[90%] text-center" style={{ left: '50%', top: '-18px' }}>
          {toastLabel}
        </div>
      )}
      <div className="relative flex items-center bg-white rounded-full border-2 border-accent/30 shadow-xl px-6 py-4 transition-all focus-within:border-accent/50 focus-within:shadow-2xl">
        <Search className="h-5 w-5 text-muted-foreground mr-3 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search countries to add..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-0 outline-none text-base placeholder:text-muted-foreground"
        />
        <button
          type="button"
          onClick={handleAddTopResult}
          disabled={!searchTerm.trim() || flatResults.length === 0 || isTopResultAdded}
          className="ml-3 rounded-full px-6 py-2 font-medium transition-all flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 active:scale-95"
          style={{
            backgroundColor: 'var(--color-accent)',
            color: 'white',
          }}
        >
          Add
        </button>
      </div>
      {showPostAddMessage && !searchTerm.trim() && (
        <div className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">
            {beenTo.length} {countryCountLabel} added
          </span>
          <span>— keep adding or</span>
          <a
            href="#map-hero"
            className="font-semibold text-accent underline decoration-2 underline-offset-4 hover:opacity-80"
          >
            go back
          </a>
        </div>
      )}

      <AutocompleteDropdown
        isOpen={isDropdownOpen && hasResults}
        searchTerm={searchTerm}
        countries={flatResults}
        selectedIndex={selectedIndex}
        beenTo={beenTo}
        onSelect={handleSelect}
        onClose={handleClose}
        inputRef={inputRef}
      />
    </div>
  );
};
