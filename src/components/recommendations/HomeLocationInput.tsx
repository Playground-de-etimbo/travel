import { useState, useRef, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Country } from '@/types/country';

interface HomeLocationInputProps {
  value: string | null;
  onChange: (countryCode: string) => void;
  countries: Country[];
  disabled?: boolean;
  placeholder?: string;
  detectedCountry?: string | null;
  onDetectionDismiss?: () => void;
  showDetectionBadge?: boolean;
}

export function HomeLocationInput({
  value,
  onChange,
  countries,
  disabled = false,
  placeholder = 'Start typing your country...',
  detectedCountry,
  onDetectionDismiss,
  showDetectionBadge = false,
}: HomeLocationInputProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get selected country name
  const selectedCountry = countries.find((c) => c.countryCode === value);
  const displayValue = selectedCountry ? selectedCountry.countryName : '';

  // Filter countries based on search
  const filteredCountries = searchTerm
    ? countries.filter((country) =>
        country.countryName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setIsOpen(newValue.length > 0);
    setSelectedIndex(0);
  };

  // Handle country selection
  const handleSelect = (countryCode: string) => {
    onChange(countryCode);
    setSearchTerm('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || filteredCountries.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredCountries.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredCountries[selectedIndex]) {
          handleSelect(filteredCountries[selectedIndex].countryCode);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        break;
    }
  };

  // Handle dismiss - clear field, focus input, and call parent handler
  const handleDismiss = () => {
    onChange(''); // Clear the country selection
    setSearchTerm(''); // Clear search term
    inputRef.current?.focus(); // Focus input
    onDetectionDismiss?.(); // Call parent handler
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get detected country details for badge
  const detectedCountryData = detectedCountry
    ? countries.find((c) => c.countryCode === detectedCountry)
    : null;

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={searchTerm || displayValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (searchTerm || !value) {
              setIsOpen(true);
            }
          }}
          disabled={disabled}
          placeholder={placeholder}
          className={cn(
            'w-full pl-10 pr-4 py-3 rounded-lg border-2 transition-colors',
            'bg-background text-foreground placeholder:text-muted-foreground',
            'focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        />
      </div>

      {/* Dropdown */}
      {isOpen && filteredCountries.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-10 w-full mt-2 bg-white border-2 border-muted rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {filteredCountries.map((country, index) => (
            <button
              key={country.countryCode}
              type="button"
              onClick={() => handleSelect(country.countryCode)}
              className={cn(
                'w-full px-4 py-2 text-left flex items-center gap-3 transition-colors',
                index === selectedIndex
                  ? 'bg-accent/10 text-accent'
                  : 'hover:bg-muted/50'
              )}
            >
              <span className="text-2xl">{country.flagEmoji}</span>
              <span className="font-medium">{country.countryName}</span>
            </button>
          ))}
        </div>
      )}

      {/* Detection badge */}
      {showDetectionBadge && detectedCountryData && (
        <div className="mt-2 text-xs text-muted-foreground">
          <span>
            We detected you live in {detectedCountryData.flagEmoji}{' '}
            {detectedCountryData.countryName} (
            <button
              type="button"
              onClick={handleDismiss}
              className="text-foreground hover:text-accent font-medium transition-colors underline decoration-dotted underline-offset-2"
              aria-label="Clear detected country"
            >
              yeah, but nah
            </button>
            )
          </span>
        </div>
      )}
    </div>
  );
}
