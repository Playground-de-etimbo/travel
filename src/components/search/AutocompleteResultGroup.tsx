import { Badge } from '@/components/ui/badge';
import type { Country } from '@/types';

interface AutocompleteResultGroupProps {
  region: string;
  countries: Country[];
  beenTo: string[];
  selectedIndex: number;
  startIndex: number;
  onSelect: (countryCode: string) => void;
  searchTerm: string;
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
  region,
  countries,
  beenTo,
  selectedIndex,
  startIndex,
  onSelect,
  searchTerm,
}: AutocompleteResultGroupProps) => {
  return (
    <div>
      <div className="px-3 py-2 text-xs font-medium text-muted-foreground bg-muted/50">
        {region}
      </div>
      <div>
        {countries.map((country, index) => {
          const globalIndex = startIndex + index;
          const isSelected = globalIndex === selectedIndex;
          const isAdded = beenTo.includes(country.countryCode);

          return (
            <button
              key={country.countryCode}
              type="button"
              data-autocomplete-index={globalIndex}
              onClick={() => !isAdded && onSelect(country.countryCode)}
              disabled={isAdded}
              className={`
                w-full px-3 py-3 text-left flex items-center gap-3 transition-colors
                ${isSelected ? 'bg-accent/10' : 'hover:bg-accent/5'}
                ${isAdded ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <span className="text-2xl">{country.flagEmoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium">
                  {highlightMatches(country.countryName, searchTerm)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {country.region}
                </div>
              </div>
              {isAdded && (
                <Badge variant="secondary" className="text-xs">
                  Added
                </Badge>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
