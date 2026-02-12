import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useSearchFilter } from '@/hooks/useSearchFilter';
import { playCountrySound } from '@/lib/sound/countrySounds';
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
  const [toastLabel, setToastLabel] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  const { filteredResults, flatResults } = useSearchFilter({
    countries,
    searchTerm,
  });

  // Auto-focus input when overlay opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setSearchTerm('');
    }
    return () => {
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }
    };
  }, [isOpen]);

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
    setSearchTerm('');
    setTimeout(() => inputRef.current?.focus(), 80);
  };

  const handleSubmit = () => {
    const topCountry = flatResults[0];
    if (!topCountry || beenTo.includes(topCountry.countryCode)) return;
    handleSelect(topCountry.countryCode);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit();
    }
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
          {toastLabel && (
            <div
              className="map-toast map-toast--add map-toast--down max-w-[85%] text-center"
              style={{ left: '50%', top: 'calc(100% + 6px)' }}
            >
              {toastLabel}
            </div>
          )}
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search countries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
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
            {flatResults.map((country, index) => {
              const isAdded = beenTo.includes(country.countryCode);
              return (
                <button
                  key={country.countryCode}
                  type="button"
                  onClick={() => !isAdded && handleSelect(country.countryCode)}
                  disabled={isAdded}
                  className={`
                    w-full px-4 py-3 text-left flex items-center gap-3 border-b border-border
                    ${index === 0 ? 'bg-accent/10' : 'active:bg-accent/10'}
                    ${isAdded ? 'opacity-50' : ''}
                  `}
                >
                  <span className="text-xl">{country.flagEmoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-1 text-sm font-medium min-w-0">
                      <span className="truncate">
                        {highlightMatches(country.countryName, searchTerm)}
                      </span>
                      <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                        in {country.region}
                      </span>
                    </div>
                  </div>
                  {index === 0 && !isAdded && (
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
        )}
      </div>

    </div>
  );
};
