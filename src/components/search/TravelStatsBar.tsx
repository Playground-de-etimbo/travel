import { useTravelStats } from '@/hooks/useTravelStats';

interface TravelStatsBarProps {
  beenTo: string[];
  totalCountries: number;
  isMobile?: boolean;
}

export const TravelStatsBar = ({ beenTo, totalCountries, isMobile = false }: TravelStatsBarProps) => {
  const { formattedString } = useTravelStats(beenTo, totalCountries, {
    showAndCounting: !isMobile
  });

  return (
    <div className="text-center mb-8">
      <p
        className="text-sm md:text-base font-medium"
        style={{ color: 'var(--color-stats-text)' }}
      >
        {formattedString}
      </p>
    </div>
  );
};
