import { useEffect, useRef } from 'react';
import { AutocompleteResultGroup } from './AutocompleteResultGroup';
import type { Country } from '@/types';

interface AutocompleteDropdownProps {
  isOpen: boolean;
  searchTerm: string;
  results: Record<string, Country[]>;
  selectedIndex: number;
  beenTo: string[];
  onSelect: (countryCode: string) => void;
  onClose: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const AutocompleteDropdown = ({
  isOpen,
  searchTerm,
  results,
  selectedIndex,
  beenTo,
  onSelect,
  onClose,
  inputRef,
}: AutocompleteDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        inputRef.current &&
        !inputRef.current.contains(target)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, inputRef]);

  if (!isOpen) return null;

  let currentIndex = 0;

  return (
    <div
      ref={dropdownRef}
      className="absolute bottom-full left-0 right-0 mb-2 bg-background border border-border rounded-lg shadow-lg overflow-hidden autocomplete-open"
      style={{
        maxHeight: 'var(--autocomplete-max-height)',
        overflowY: 'auto',
      }}
    >
      {Object.entries(results).map(([region, countries]) => {
        const startIndex = currentIndex;
        currentIndex += countries.length;

        return (
          <AutocompleteResultGroup
            key={region}
            region={region}
            countries={countries}
            beenTo={beenTo}
            selectedIndex={selectedIndex}
            startIndex={startIndex}
            onSelect={onSelect}
            searchTerm={searchTerm}
          />
        );
      })}
    </div>
  );
};
