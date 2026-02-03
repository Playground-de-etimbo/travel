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
    <div className="flex justify-center">
      <p className="text-sm font-medium text-gray-800 whitespace-nowrap">
        {formattedString}
      </p>
    </div>
  );
};
