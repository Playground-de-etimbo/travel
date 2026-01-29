import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useSearchFilter } from '@/hooks/useSearchFilter';
import type { Country } from '@/types';

interface MobileSearchOverlayProps {
  isOpen: boolean;
  countries: Country[];
  beenTo: string[];
  onAddCountry: (countryCode: string) => void;
  onClose: () => void;
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

export const MobileSearchOverlay = ({
  isOpen,
  countries,
  beenTo,
  onAddCountry,
  onClose,
}: MobileSearchOverlayProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const { filteredResults } = useSearchFilter({
    countries,
    searchTerm,
    maxPerRegion: 5,
  });

  // Auto-focus input when overlay opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  const handleSelect = (countryCode: string) => {
    onAddCountry(countryCode);
    setSearchTerm('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-md">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-border px-4 py-3 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Close search"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search countries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Results */}
      <div className="overflow-y-auto" style={{ height: 'calc(100vh - 65px)' }}>
        {!searchTerm.trim() ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>Start typing to search countries...</p>
          </div>
        ) : Object.keys(filteredResults).length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>No countries found</p>
          </div>
        ) : (
          <div>
            {Object.entries(filteredResults).map(([region, regionCountries]) => (
              <div key={region}>
                <div className="px-4 py-2 text-xs font-medium text-muted-foreground bg-muted/50 sticky top-0">
                  {region}
                </div>
                <div>
                  {regionCountries.map((country) => {
                    const isAdded = beenTo.includes(country.countryCode);
                    return (
                      <button
                        key={country.countryCode}
                        type="button"
                        onClick={() => !isAdded && handleSelect(country.countryCode)}
                        disabled={isAdded}
                        className={`
                          w-full px-4 py-4 text-left flex items-center gap-3 border-b border-border
                          ${isAdded ? 'opacity-50' : 'active:bg-accent/10'}
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
