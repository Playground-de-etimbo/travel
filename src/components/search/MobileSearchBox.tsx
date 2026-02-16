import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { AutocompleteDropdown } from './AutocompleteDropdown';
import { useSearchFilter } from '@/hooks/useSearchFilter';
import { useCountryAliases } from '@/hooks/useCountryAliases';
import { useAutocomplete } from '@/hooks/useAutocomplete';
import { playCountrySound } from '@/lib/sound/countrySounds';
import type { Country } from '@/types';

interface MobileSearchBoxProps {
  countries: Country[];
  beenTo: string[];
  onAddCountry: (countryCode: string) => void;
  onCollapse?: () => void;
  searchInputRef?: React.RefObject<HTMLInputElement>;
  onFocusChange?: (isFocused: boolean) => void;
}

export const MobileSearchBox = ({
  countries,
  beenTo,
  onAddCountry,
  onCollapse,
  searchInputRef,
  onFocusChange,
}: MobileSearchBoxProps) => {
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [toastLabel, setToastLabel] = useState<string | null>(null);
  const internalInputRef = useRef<HTMLInputElement>(null);
  const inputRef = searchInputRef || internalInputRef;
  const clearTimeoutRef = useRef<NodeJS.Timeout>();
  const toastTimeoutRef = useRef<number | null>(null);
  const preventScrollOnFocusRef = useRef(false);
  const debounceRef = useRef<NodeJS.Timeout>();

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearchTerm(value), 150);
  }, []);

  const aliases = useCountryAliases();
  const { flatResults } = useSearchFilter({
    countries,
    searchTerm,
    aliases,
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
    setInputValue('');
    setSearchTerm('');

    // Prevent scroll on refocus after selection
    preventScrollOnFocusRef.current = true;
    inputRef.current?.focus();

    // Clear input after 300ms delay
    clearTimeoutRef.current = setTimeout(() => {
      setInputValue('');
      setSearchTerm('');
      preventScrollOnFocusRef.current = true;
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
      beenTo,
      onSelect: handleSelect,
      onClose: handleClose,
    });

  // Open dropdown when typing starts
  useEffect(() => {
    if (searchTerm.trim()) {
      setIsDropdownOpen(true);
      const firstAvailable = flatResults.findIndex(
        (c) => !beenTo.includes(c.countryCode)
      );
      setSelectedIndex(firstAvailable >= 0 ? firstAvailable : 0);
    } else {
      setIsDropdownOpen(false);
    }
  }, [searchTerm, flatResults, beenTo, setSelectedIndex]);

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
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
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
      <div className="relative flex items-center bg-card text-card-foreground rounded-full border-2 border-accent/20 shadow-md px-4 py-3 transition-all focus-within:border-accent/40 focus-within:shadow-lg active:shadow-xl">
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
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsFocused(true);
            onFocusChange?.(true);

            // Scroll panel further up when focused to maximize visible area
            // Skip scroll if this is a programmatic refocus after selection
            if (!preventScrollOnFocusRef.current) {
              setTimeout(() => {
                window.scrollBy({
                  top: window.innerHeight * 0.15, // Scroll down 15vh to pull panel up more
                  behavior: 'smooth'
                });
              }, 100);
            } else {
              // Reset flag for next focus
              preventScrollOnFocusRef.current = false;
            }
          }}
          onBlur={() => {
            setIsFocused(false);
            onFocusChange?.(false);
          }}
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
