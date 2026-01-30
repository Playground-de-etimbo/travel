import { useState, useRef, useEffect } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { AutocompleteDropdown } from './AutocompleteDropdown';
import { useSearchFilter } from '@/hooks/useSearchFilter';
import { useAutocomplete } from '@/hooks/useAutocomplete';
import { playCountrySound } from '@/lib/sound/countrySounds';
import type { Country } from '@/types';

interface MobileSearchBoxProps {
  countries: Country[];
  beenTo: string[];
  onAddCountry: (countryCode: string) => void;
  onCollapse?: () => void;
  searchInputRef?: React.RefObject<HTMLInputElement>;
}

export const MobileSearchBox = ({
  countries,
  beenTo,
  onAddCountry,
  onCollapse,
  searchInputRef,
}: MobileSearchBoxProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [toastLabel, setToastLabel] = useState<string | null>(null);
  const internalInputRef = useRef<HTMLInputElement>(null);
  const inputRef = searchInputRef || internalInputRef;
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

  const handleBackClick = () => {
    // Blur input to close keyboard
    inputRef.current?.blur();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(25);
    }

    // Optional callback
    if (onCollapse) {
      onCollapse();
    }
  };

  const { handleKeyDown, selectedIndex, setSelectedIndex, scrollToItem } =
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

  const placeholderText = beenTo.length === 0 ? 'Where have you been? Type here' : 'Where else have you been? Type here';

  return (
    <div className="relative">
      {toastLabel && (
        <div className="map-toast map-toast--add max-w-[90%] text-center" style={{ left: '50%', top: '-18px' }}>
          {toastLabel}
        </div>
      )}
      <div className="relative flex items-center bg-white rounded-full border-2 border-accent/30 shadow-lg px-4 py-3 transition-all focus-within:border-accent/50 focus-within:shadow-xl">
        {/* Back button when focused, Search icon when blurred */}
        {isFocused ? (
          <button
            type="button"
            onClick={handleBackClick}
            className="h-5 w-5 text-muted-foreground mr-3 flex-shrink-0 active:scale-90 transition-transform"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        ) : (
          <Search className="h-5 w-5 text-muted-foreground mr-3 flex-shrink-0" />
        )}

        <input
          ref={inputRef}
          type="text"
          placeholder={placeholderText}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 bg-transparent border-0 outline-none text-base placeholder:text-muted-foreground"
        />
      </div>

      <AutocompleteDropdown
        isOpen={isDropdownOpen && hasResults}
        searchTerm={searchTerm}
        countries={flatResults}
        selectedIndex={selectedIndex}
        beenTo={beenTo}
        onSelect={handleSelect}
        onClose={handleClose}
        inputRef={inputRef}
        position="below"
        showRegion={false}
      />
    </div>
  );
};
