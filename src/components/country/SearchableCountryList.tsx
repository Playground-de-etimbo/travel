import { useState, useMemo, useEffect, useRef } from 'react';
import Fuse from 'fuse.js';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import type { Country } from '@/types';

interface SearchableCountryListProps {
  countries: Country[];
  beenTo: string[];
  onAddCountry: (code: string) => void;
  preSelectedCountry?: string;
}

const REGIONS = [
  'All',
  'Africa',
  'Asia',
  'Europe',
  'North America',
  'South America',
  'Oceania',
];

export function SearchableCountryList({
  countries,
  beenTo,
  onAddCountry,
  preSelectedCountry,
}: SearchableCountryListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const preSelectedRef = useRef<HTMLButtonElement>(null);

  // Configure fuzzy search with fuse.js
  const fuse = useMemo(() => {
    return new Fuse(countries, {
      keys: ['countryName', 'countryCode', 'region'],
      threshold: 0.3,
      includeScore: true,
    });
  }, [countries]);

  // Filter countries based on search and region
  const filteredCountries = useMemo(() => {
    let results = countries;

    // Apply fuzzy search if there's a search term
    if (searchTerm.trim()) {
      const fuseResults = fuse.search(searchTerm);
      results = fuseResults.map(result => result.item);
    }

    // Apply region filter
    if (selectedRegion !== 'All') {
      results = results.filter(country => country.region === selectedRegion);
    }

    return results;
  }, [countries, searchTerm, selectedRegion, fuse]);

  // Group countries alphabetically
  const groupedCountries = useMemo(() => {
    const groups: Record<string, Country[]> = {};

    filteredCountries.forEach(country => {
      const firstLetter = country.countryName[0].toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(country);
    });

    // Sort each group
    Object.keys(groups).forEach(letter => {
      groups[letter].sort((a, b) => a.countryName.localeCompare(b.countryName));
    });

    return groups;
  }, [filteredCountries]);

  const sortedLetters = Object.keys(groupedCountries).sort();

  const handleAddCountry = (countryCode: string) => {
    onAddCountry(countryCode);
    // Clear search after adding for rapid-fire additions
    setSearchTerm('');
  };

  // Auto-scroll to pre-selected country
  useEffect(() => {
    if (preSelectedCountry && preSelectedRef.current) {
      setTimeout(() => {
        preSelectedRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 100);
    }
  }, [preSelectedCountry]);

  return (
    <div className="flex flex-col h-full max-h-[70vh]">
      {/* Search input */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search countries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            autoFocus
          />
        </div>
      </div>

      {/* Region filter */}
      <div className="p-4 border-b border-border">
        <div className="flex flex-wrap gap-2">
          {REGIONS.map(region => (
            <Badge
              key={region}
              variant={selectedRegion === region ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedRegion(region)}
            >
              {region}
            </Badge>
          ))}
        </div>
      </div>

      {/* Country list */}
      <div className="flex-1 overflow-y-auto p-4">
        {sortedLetters.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No countries found matching your search.
          </div>
        ) : (
          <div className="space-y-4">
            {sortedLetters.map(letter => (
              <div key={letter}>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2 sticky top-0 bg-background/95 backdrop-blur-sm py-1">
                  {letter}
                </h3>
                <div className="space-y-1">
                  {groupedCountries[letter].map(country => {
                    const isAdded = beenTo.includes(country.countryCode);
                    const isPreSelected = country.countryCode === preSelectedCountry;

                    return (
                      <Button
                        key={country.countryCode}
                        ref={isPreSelected ? preSelectedRef : undefined}
                        variant={isPreSelected ? 'default' : 'ghost'}
                        className={`w-full justify-start text-left h-auto py-2 ${
                          isAdded ? 'opacity-50' : ''
                        }`}
                        onClick={() => !isAdded && handleAddCountry(country.countryCode)}
                        disabled={isAdded}
                      >
                        <span className="text-2xl mr-3">{country.flagEmoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{country.countryName}</div>
                          <div className="text-xs text-muted-foreground">
                            {country.region}
                          </div>
                        </div>
                        {isAdded && (
                          <Badge variant="secondary" className="ml-2">
                            Added
                          </Badge>
                        )}
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        /* Custom scrollbar */
        .overflow-y-auto::-webkit-scrollbar {
          width: 8px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: hsl(var(--muted-foreground) / 0.3);
          border-radius: 4px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground) / 0.5);
        }
      `}</style>
    </div>
  );
}
