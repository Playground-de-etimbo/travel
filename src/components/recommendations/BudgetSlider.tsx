import { Backpack, Hotel, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BudgetTier } from '@/types/recommendation';

interface BudgetOption {
  id: BudgetTier;
  label: string;
  symbol: string;
  description: string;
  icon: typeof Backpack;
}

const BUDGET_OPTIONS: BudgetOption[] = [
  {
    id: 'budget',
    label: 'Budget',
    symbol: '$',
    description: 'Hostels, street food, public transit, free attractions',
    icon: Backpack,
  },
  {
    id: 'modest',
    label: 'Modest',
    symbol: '$$',
    description: '3-star hotels, local restaurants, taxis, paid tours',
    icon: Hotel,
  },
  {
    id: 'bougie',
    label: 'Bougie',
    symbol: '$$$',
    description: 'Luxury hotels, fine dining, private transport, premium experiences',
    icon: Crown,
  },
];

interface BudgetSliderProps {
  tier: BudgetTier;
  onTierChange: (tier: BudgetTier) => void;
}

export function BudgetSlider({ tier, onTierChange }: BudgetSliderProps) {
  return (
    <div className="mb-6">
      <div className="mb-3 text-center">
        <label className="text-base font-semibold text-foreground/90">Budget Level</label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {BUDGET_OPTIONS.map((option) => {
          const isSelected = tier === option.id;
          const Icon = option.icon;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onTierChange(option.id)}
              className={cn(
                'relative p-5 rounded-lg border-2 transition-all duration-200',
                'flex flex-col items-center gap-3 text-center',
                isSelected
                  ? 'bg-accent/10 border-accent shadow-md scale-[1.02]'
                  : 'bg-white border-muted hover:shadow-md active:scale-[0.98]'
              )}
            >
              {/* Unique icon */}
              <Icon
                className={cn(
                  'h-8 w-8 transition-colors',
                  isSelected ? 'text-accent' : 'text-muted-foreground'
                )}
              />

              {/* Label and symbol */}
              <div>
                <p
                  className={cn(
                    'text-lg font-bold',
                    isSelected ? 'text-accent' : 'text-foreground'
                  )}
                >
                  {option.label} {option.symbol}
                </p>
                <p
                  className={cn(
                    'text-xs mt-2 leading-relaxed',
                    isSelected ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {option.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
