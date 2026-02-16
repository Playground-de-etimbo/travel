import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Search } from 'lucide-react';
import { AutocompleteDropdown } from './AutocompleteDropdown';
import { useSearchFilter } from '@/hooks/useSearchFilter';
import { useCountryAliases } from '@/hooks/useCountryAliases';
import { useAutocomplete } from '@/hooks/useAutocomplete';
import { playCountrySound } from '@/lib/sound/countrySounds';
import type { Country } from '@/types';

interface SearchBoxProps {
  countries: Country[];
  beenTo: string[];
  onAddCountry: (countryCode: string) => void;
  searchInputRef?: React.RefObject<HTMLInputElement>;
}

export const SearchBox = ({ countries, beenTo, onAddCountry, searchInputRef }: SearchBoxProps) => {
  const [inputValue, setInputValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [toastLabel, setToastLabel] = useState<string | null>(null);

  const internalInputRef = useRef<HTMLInputElement>(null);
  const inputRef = searchInputRef || internalInputRef;
  const clearTimeoutRef = useRef<NodeJS.Timeout>();
  const toastTimeoutRef = useRef<number | null>(null);
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
    inputRef.current?.focus();

    // Clear input after 300ms delay
    clearTimeoutRef.current = setTimeout(() => {
      setInputValue('');
      setSearchTerm('');
      inputRef.current?.focus();
    }, 300);
  };

  const handleClose = () => {
    setIsDropdownOpen(false);
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

  const firstAvailableCountry = useMemo(() => {
    return flatResults.find((c) => !beenTo.includes(c.countryCode)) ?? null;
  }, [flatResults, beenTo]);

  const handleAddTopResult = () => {
    if (!firstAvailableCountry) return;
    setToastLabel(`Added ${firstAvailableCountry.countryName}`);
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastLabel(null);
    }, 1600);
    void playCountrySound('add');
    onAddCountry(firstAvailableCountry.countryCode);
    setInputValue('');
    setSearchTerm('');
    inputRef.current?.focus();
    setTimeout(() => setIsDropdownOpen(false), 300);
    setTimeout(() => inputRef.current?.focus(), 320);
  };

  const placeholderText = beenTo.length === 0 ? 'Where have you been? Type here' : 'Where else have you been? Type here';

  return (
    <div className="relative hidden md:block max-w-4xl mx-auto mb-8">
      {toastLabel && (
        <div className="map-toast map-toast--add max-w-[90%] text-center" style={{ left: '50%', top: '-18px' }}>
          {toastLabel}
        </div>
      )}
      <div className="relative flex items-center bg-card text-card-foreground rounded-full border-2 border-accent/20 shadow-lg px-6 py-3.5 transition-all focus-within:border-accent/40 focus-within:shadow-xl hover:shadow-xl">
        <Search className="h-5 w-5 text-muted-foreground mr-3 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholderText}
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-0 outline-none text-base placeholder:text-muted-foreground"
        />
        <button
          type="button"
          onClick={handleAddTopResult}
          disabled={!inputValue.trim() || !firstAvailableCountry}
          className="ml-3 rounded-full px-6 py-2 font-medium transition-all flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 active:scale-95"
          style={{
            backgroundColor: 'var(--color-accent)',
            color: 'white',
          }}
        >
          Add
        </button>
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
      />
    </div>
  );
};
