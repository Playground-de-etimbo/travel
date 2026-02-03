import { Sun, Palmtree, Landmark, Footprints, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { TravelInterest } from '@/types/recommendation';

interface InterestOption {
  id: TravelInterest;
  label: string;
  icon: typeof Sun;
  gradient: string;
  description: string;
}

const INTERESTS: InterestOption[] = [
  {
    id: 'weather',
    label: 'Weather',
    icon: Sun,
    gradient: 'from-yellow-400 to-orange-500',
    description: 'Warm climates, beaches, year-round sunshine',
  },
  {
    id: 'relaxation',
    label: 'Relaxation',
    icon: Palmtree,
    gradient: 'from-teal-400 to-cyan-500',
    description: 'Peaceful retreats, spas, tranquil escapes',
  },
  {
    id: 'culture',
    label: 'Culture',
    icon: Landmark,
    gradient: 'from-purple-400 to-pink-500',
    description: 'Museums, history, traditions, architecture',
  },
  {
    id: 'action',
    label: 'Action',
    icon: Footprints,
    gradient: 'from-blue-400 to-indigo-500',
    description: 'Hiking, adventure sports, outdoor exploration',
  },
];

interface InterestsSelectorProps {
  selected: TravelInterest[];
  onChange: (interests: TravelInterest[]) => void;
  disabled?: boolean;
}

export function InterestsSelector({
  selected,
  onChange,
  disabled = false,
}: InterestsSelectorProps) {
  const handleToggle = (interestId: TravelInterest) => {
    if (disabled) return;

    if (selected.includes(interestId)) {
      onChange(selected.filter((id) => id !== interestId));
    } else {
      onChange([...selected, interestId]);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {INTERESTS.map((interest) => {
        const isSelected = selected.includes(interest.id);
        const Icon = interest.icon;

        return (
          <button
            key={interest.id}
            type="button"
            onClick={() => handleToggle(interest.id)}
            disabled={disabled}
            className={cn(
              'relative p-5 rounded-lg transition-all duration-200',
              'flex flex-col items-center gap-3',
              isSelected
                ? `bg-gradient-to-br ${interest.gradient} border-2 border-accent shadow-md scale-[1.02]`
                : 'bg-white border-2 border-muted hover:shadow-md hover:scale-[1.02]',
              disabled && 'cursor-not-allowed opacity-40'
            )}
          >
            {/* Icon */}
            <Icon
              className={cn(
                'h-8 w-8 transition-colors',
                isSelected ? 'text-white' : 'text-muted-foreground'
              )}
            />

            {/* Label and Description */}
            <div className="text-center">
              <p
                className={cn(
                  'text-sm font-semibold',
                  isSelected ? 'text-white' : 'text-foreground'
                )}
              >
                {interest.label}
              </p>
              <p
                className={cn(
                  'text-xs mt-1 leading-relaxed',
                  isSelected ? 'text-white/90' : 'text-muted-foreground'
                )}
              >
                {interest.description}
              </p>
            </div>

            {/* Checkmark overlay when selected */}
            {isSelected && (
              <div className="absolute top-2 right-2 bg-white/30 rounded-full p-1">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
