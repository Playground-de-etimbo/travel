import { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AutocompleteDropdown } from './AutocompleteDropdown';
import { useSearchFilter } from '@/hooks/useSearchFilter';
import { useAutocomplete } from '@/hooks/useAutocomplete';
import type { Country } from '@/types';

interface SearchBoxProps {
  countries: Country[];
  beenTo: string[];
  onAddCountry: (countryCode: string) => void;
}

export const SearchBox = ({ countries, beenTo, onAddCountry }: SearchBoxProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const clearTimeoutRef = useRef<NodeJS.Timeout>();

  const { filteredResults } = useSearchFilter({
    countries,
    searchTerm,
    maxPerRegion: 5,
  });

  const hasResults = Object.keys(filteredResults).length > 0;

  const handleSelect = (countryCode: string) => {
    onAddCountry(countryCode);
    setIsDropdownOpen(false);
    setSearchTerm('');

    // Clear input after 300ms delay
    clearTimeoutRef.current = setTimeout(() => {
      setSearchTerm('');
      inputRef.current?.blur();
    }, 300);
  };

  const handleClose = () => {
    setIsDropdownOpen(false);
  };

  const { handleKeyDown, selectableItems, selectedIndex, setSelectedIndex, scrollToItem } =
    useAutocomplete({
      filteredResults,
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
    };
  }, []);

  const handleSubmit = () => {
    if (selectableItems.length > 0 && selectableItems[selectedIndex]) {
      handleSelect(selectableItems[selectedIndex].country.countryCode);
    }
  };

  return (
    <div className="relative hidden md:block max-w-2xl mx-auto mb-8">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search countries to add..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-9"
          />
        </div>
        <Button
          onClick={handleSubmit}
          disabled={!hasResults || selectableItems.length === 0}
        >
          Select country
        </Button>
      </div>

      <AutocompleteDropdown
        isOpen={isDropdownOpen && hasResults}
        searchTerm={searchTerm}
        results={filteredResults}
        selectedIndex={selectedIndex}
        beenTo={beenTo}
        onSelect={handleSelect}
        onClose={handleClose}
        inputRef={inputRef}
      />
    </div>
  );
};
