import { cn } from '@/lib/utils';
import type { FlightDuration } from '@/types/recommendation';

interface DurationOption {
  id: FlightDuration;
  label: string;
  displayText: string;
  description: string;
}

const DURATIONS: DurationOption[] = [
  {
    id: 'under-3',
    label: 'Under 3 hours',
    displayText: '< 3h',
    description: 'Nearby',
  },
  {
    id: '3-6',
    label: '3-6 hours',
    displayText: '3-6h',
    description: 'Regional',
  },
  {
    id: '6-12',
    label: '6-12 hours',
    displayText: '6-12h',
    description: 'International',
  },
  {
    id: '12-plus',
    label: '12+ hours',
    displayText: '12h+',
    description: 'Long Haul',
  },
];

interface FlightDurationSelectorProps {
  value: FlightDuration | null;
  onChange: (duration: FlightDuration) => void;
  disabled?: boolean;
}

export function FlightDurationSelector({
  value,
  onChange,
  disabled = false,
}: FlightDurationSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {DURATIONS.map((duration) => {
        const isSelected = value === duration.id;

        return (
          <button
            key={duration.id}
            type="button"
            onClick={() => onChange(duration.id)}
            disabled={disabled}
            className={cn(
              'relative p-6 rounded-lg border-2 transition-all duration-200',
              'flex flex-col items-center justify-center gap-2',
              isSelected
                ? 'bg-accent/10 border-accent shadow-md scale-[1.02]'
                : 'bg-white border-muted hover:shadow-md hover:scale-[1.02]',
              disabled && 'cursor-not-allowed opacity-40'
            )}
          >
            {/* Large display text */}
            <p
              className={cn(
                'text-3xl font-bold transition-colors',
                isSelected ? 'text-accent' : 'text-foreground'
              )}
            >
              {duration.displayText}
            </p>

            {/* Description */}
            <p
              className={cn(
                'text-xs mt-1',
                isSelected ? 'text-accent' : 'text-muted-foreground'
              )}
            >
              {duration.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
