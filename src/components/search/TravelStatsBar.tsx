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
    <div className="flex justify-center">
      <div
        className="backdrop-blur-md bg-white/80 rounded-full px-5 py-2.5 shadow-lg border border-white/20"
        style={{
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)'
        }}
      >
        <p className="text-sm font-medium text-gray-800 whitespace-nowrap">
          {formattedString}
        </p>
      </div>
    </div>
  );
};
