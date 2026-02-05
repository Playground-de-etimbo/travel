import type { BudgetTier, CostBreakdown } from '@/types/recommendation';
import type { Country } from '@/types/country';

interface TravelCostData {
  hotelPerNight: number;
  dailyPerPerson: number;
}

interface CountryTravelCosts {
  budget: TravelCostData;
  modest: TravelCostData;
  bougie: TravelCostData;
}

type TravelCostsDatabase = Record<string, CountryTravelCosts>;

let travelCostsCache: TravelCostsDatabase | null = null;

/**
 * Load travel costs data from JSON file (cached)
 */
async function loadTravelCosts(): Promise<TravelCostsDatabase> {
  if (travelCostsCache) {
    return travelCostsCache;
  }

  try {
    const response = await fetch('/data/country-travel-costs.json');
    if (!response.ok) {
      throw new Error(`Failed to load travel costs: ${response.status}`);
    }
    const data = await response.json();
    travelCostsCache = data;
    return data;
  } catch (error) {
    console.error('Failed to load travel costs data:', error);
    // Return empty object as fallback
    return {};
  }
}

/**
 * Calculate flight cost based on distance
 * Uses distance-based pricing with regional adjustments
 */
function calculateFlightCost(distanceKm: number, tier: BudgetTier): number {
  // Base rate: $0.10 per km for modest
  let baseRate = 0.10;

  // Tier multipliers
  if (tier === 'budget') {
    baseRate *= 0.7;
  } else if (tier === 'bougie') {
    baseRate *= 2.0;
  }

  return Math.round(distanceKm * baseRate);
}

/**
 * Calculate costs for all budget tiers for a country
 * @param country Country data
 * @param distanceKm Flight distance in kilometers
 * @returns Cost breakdowns for all three tiers
 */
export async function calculateCosts(
  country: Country,
  distanceKm: number
): Promise<Record<BudgetTier, CostBreakdown>> {
  const travelCosts = await loadTravelCosts();
  const countryCosts = travelCosts[country.countryCode];

  const result: Record<BudgetTier, CostBreakdown> = {} as Record<
    BudgetTier,
    CostBreakdown
  >;

  for (const tier of ['budget', 'modest', 'bougie'] as BudgetTier[]) {
    // Calculate flight based on distance
    const flight = calculateFlightCost(distanceKm, tier);

    // Get hotel and daily costs from data file, or use defaults
    let hotel = 100; // Default fallback
    let daily = 80;  // Default fallback

    if (countryCosts && countryCosts[tier]) {
      hotel = countryCosts[tier].hotelPerNight;
      daily = countryCosts[tier].dailyPerPerson;
    }

    // Calculate 7-day trip total
    const total = flight + hotel * 7 + daily * 7;

    result[tier] = {
      flight,
      hotel,
      daily,
      total,
    };
  }

  return result;
}
