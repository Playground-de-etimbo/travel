import { useState, useCallback, useMemo } from 'react';
import type { Country } from '@/types';

interface SelectableItem {
  type: 'country';
  country: Country;
  index: number;
}

interface UseAutocompleteOptions {
  filteredResults: Record<string, Country[]>;
  onSelect: (countryCode: string) => void;
  onClose: () => void;
}

export const useAutocomplete = ({
  filteredResults,
  onSelect,
  onClose,
}: UseAutocompleteOptions) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Flatten grouped results into selectable items (skip region headers)
  const selectableItems = useMemo(() => {
    const items: SelectableItem[] = [];
    let index = 0;

    Object.entries(filteredResults).forEach(([_, countries]) => {
      countries.forEach((country) => {
        items.push({
          type: 'country',
          country,
          index,
        });
        index++;
      });
    });

    return items;
  }, [filteredResults]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (selectableItems.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < selectableItems.length - 1 ? prev + 1 : 0
          );
          break;

        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : selectableItems.length - 1
          );
          break;

        case 'Enter':
          e.preventDefault();
          if (selectableItems[selectedIndex]) {
            onSelect(selectableItems[selectedIndex].country.countryCode);
          }
          break;

        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    },
    [selectableItems, selectedIndex, onSelect, onClose]
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
