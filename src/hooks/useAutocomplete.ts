import { useState, useCallback, useMemo } from 'react';
import type { Country } from '@/types';

interface UseAutocompleteOptions {
  results: Country[];
  beenTo: string[];
  onSelect: (countryCode: string) => void;
  onClose: () => void;
}

export const useAutocomplete = ({
  results,
  beenTo,
  onSelect,
  onClose,
}: UseAutocompleteOptions) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Flatten results into selectable items
  const selectableItems = useMemo(() => {
    return results.map((country, index) => ({
      type: 'country',
      country,
      index,
    }));
  }, [results]);

  // Find the next available (non-added) index in a given direction
  const findNextAvailable = useCallback(
    (from: number, direction: 1 | -1): number => {
      const len = selectableItems.length;
      for (let i = 1; i <= len; i++) {
        const idx = (from + direction * i + len) % len;
        if (!beenTo.includes(selectableItems[idx].country.countryCode)) {
          return idx;
        }
      }
      return from; // all added, stay put
    },
    [selectableItems, beenTo]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (selectableItems.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => findNextAvailable(prev, 1));
          break;

        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => findNextAvailable(prev, -1));
          break;

        case 'Enter':
          e.preventDefault();
          if (selectableItems[selectedIndex] && !beenTo.includes(selectableItems[selectedIndex].country.countryCode)) {
            onSelect(selectableItems[selectedIndex].country.countryCode);
          }
          break;

        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    },
    [selectableItems, selectedIndex, beenTo, onSelect, onClose, findNextAvailable]
  );

  const scrollToItem = useCallback((index: number) => {
    const element = document.querySelector(
      `[data-autocomplete-index="${index}"]`
    );
    element?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, []);

  return {
    handleKeyDown,
    selectableItems,
    selectedIndex,
    setSelectedIndex,
    scrollToItem,
  };
};
