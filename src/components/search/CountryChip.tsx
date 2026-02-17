import { memo } from 'react';
import { MinusCircle } from 'lucide-react';
import type { Country } from '@/types';

interface CountryChipProps {
  country: Country;
  onRemove: (countryCode: string) => void;
  animationDelay?: number;
  isRecentlyAdded?: boolean;
}

export const CountryChip = memo(({
  country,
  onRemove,
  animationDelay = 0,
  isRecentlyAdded = false,
}: CountryChipProps) => {
  return (
    <div
      className={`
        group inline-flex items-center gap-2 px-3 py-1.5 rounded-full
        border border-border/60 bg-card
        hover:bg-accent/5 hover:border-accent/30 hover:shadow-sm
        transition-all duration-200
        ${isRecentlyAdded ? 'country-chip-enter' : ''}
      `}
      style={animationDelay > 0 ? { animationDelay: `${animationDelay}ms` } : undefined}
    >
      <span className="text-xl">{country.flagEmoji}</span>
      <span className="text-sm font-medium leading-none">{country.countryName}</span>
      <button
        type="button"
        onClick={() => onRemove(country.countryCode)}
        className="relative opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
        aria-label={`Remove ${country.countryName}`}
      >
        {/* Larger touch target */}
        <span className="absolute inset-0 -m-2" />
        <MinusCircle className="h-4 w-4 text-muted-foreground hover:text-destructive transition-colors" />
      </button>
    </div>
  );
});
