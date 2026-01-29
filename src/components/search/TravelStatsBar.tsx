import { useTravelStats } from '@/hooks/useTravelStats';

interface TravelStatsBarProps {
  beenTo: string[];
  totalCountries: number;
}

export const TravelStatsBar = ({ beenTo, totalCountries }: TravelStatsBarProps) => {
  const { formattedString } = useTravelStats(beenTo, totalCountries);

  return (
    <div className="text-center mb-8">
      <p
        className="text-sm md:text-base font-medium"
        style={{ color: 'hsl(var(--color-stats-text))' }}
      >
        {formattedString}
      </p>
    </div>
  );
};
