import { Badge } from '@/components/ui/badge';
import type { Country } from '@/types';

interface AutocompleteResultGroupProps {
  countries: Country[];
  beenTo: string[];
  selectedIndex: number;
  startIndex: number;
  onSelect: (countryCode: string) => void;
  searchTerm: string;
  showRegion?: boolean;
}

const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const highlightMatches = (text: string, searchTerm: string) => {
  if (!searchTerm) return text;
  const regex = new RegExp(`(${escapeRegex(searchTerm)})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? <strong key={i} className="font-bold">{part}</strong> : part
  );
};

export const AutocompleteResultGroup = ({
  countries,
  beenTo,
  selectedIndex,
  startIndex,
  onSelect,
  searchTerm,
  showRegion = true,
}: AutocompleteResultGroupProps) => {
  return (
    <div>
      <div>
        {countries.map((country, index) => {
          const globalIndex = startIndex + index;
          const isSelected = globalIndex === selectedIndex;
          const isTopMatch = globalIndex === 0;
          const isAdded = beenTo.includes(country.countryCode);

          return (
            <button
              key={country.countryCode}
              type="button"
              data-autocomplete-index={globalIndex}
              onClick={() => !isAdded && onSelect(country.countryCode)}
              disabled={isAdded}
              className={`
                w-full px-4 py-2.5 text-left flex items-center gap-3 transition-colors
                ${isSelected ? 'bg-accent/10' : 'hover:bg-accent/5'}
                ${isAdded ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <span className="text-xl">{country.flagEmoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1 text-sm font-medium min-w-0">
                  <span className="truncate">
                    {highlightMatches(country.countryName, searchTerm)}
                  </span>
                  {showRegion && (
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                      in {country.region}
                    </span>
                  )}
                </div>
              </div>
              {isTopMatch && !isAdded && (
                <Badge variant="default">
                  Best match
                </Badge>
              )}
              {isAdded && (
                <Badge variant="outline" className="bg-secondary/80 border-border/70 text-foreground">
                  Already added
                </Badge>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
