import { useEffect, useRef } from 'react';
import { AutocompleteResultGroup } from './AutocompleteResultGroup';
import type { Country } from '@/types';

interface AutocompleteDropdownProps {
  isOpen: boolean;
  searchTerm: string;
  countries: Country[];
  selectedIndex: number;
  beenTo: string[];
  onSelect: (countryCode: string) => void;
  onClose: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
  position?: 'above' | 'below'; // Position relative to input
  showRegion?: boolean; // Show region in results
}

export const AutocompleteDropdown = ({
  isOpen,
  searchTerm,
  countries,
  selectedIndex,
  beenTo,
  onSelect,
  onClose,
  inputRef,
  position = 'above', // Default to above for desktop compatibility
  showRegion = true, // Default to showing region
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

  const positionClasses = position === 'below'
    ? 'top-full mt-3'
    : 'bottom-full mb-3';

  return (
    <div
      ref={dropdownRef}
      className={`absolute ${positionClasses} left-0 right-0 z-40 bg-card text-card-foreground border-2 border-accent/20 rounded-3xl shadow-2xl overflow-hidden autocomplete-open`}
      style={{
        maxHeight: 'var(--autocomplete-max-height)',
        overflowY: 'auto',
      }}
    >
      <AutocompleteResultGroup
        countries={countries}
        beenTo={beenTo}
        selectedIndex={selectedIndex}
        startIndex={0}
        onSelect={onSelect}
        searchTerm={searchTerm}
        showRegion={showRegion}
      />
    </div>
  );
};
