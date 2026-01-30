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

  // Don't render on mobile
  if (isMobile) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-full px-6 py-3 shadow-md">
        <p className="text-sm font-medium text-center text-gray-700">
          {formattedString}
        </p>
      </div>
    </div>
  );
};
