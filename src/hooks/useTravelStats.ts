import { useMemo } from 'react';

interface TravelStats {
  visitedCount: number;
  remainingCount: number;
  percentageExplored: number;
  formattedString: string;
}

export const useTravelStats = (
  beenTo: string[],
  totalCountries: number
): TravelStats => {
  return useMemo(() => {
    const visitedCount = beenTo.length;
    const remainingCount = totalCountries - visitedCount;
    const percentageExplored =
      totalCountries > 0 ? (visitedCount / totalCountries) * 100 : 0;

    const formattedString =
      visitedCount === 0
        ? `0% of the world explored • ${totalCountries} countries to discover`
        : `${percentageExplored.toFixed(1)}% of the world explored • ${visitedCount} ${
            visitedCount === 1 ? 'country' : 'countries'
          } and counting • ${remainingCount} to go`;

    return {
      visitedCount,
      remainingCount,
      percentageExplored,
      formattedString,
    };
  }, [beenTo, totalCountries]);
};
