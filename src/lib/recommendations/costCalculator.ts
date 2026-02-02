import type { BudgetTier, CostBreakdown } from '@/types/recommendation';
import type { Country } from '@/types/country';

/**
 * Budget tier multipliers for cost calculation
 */
const TIER_MULTIPLIERS: Record<BudgetTier, number> = {
  budget: 0.7,
  modest: 1.0,
  bougie: 2.5,
};

/**
 * Calculate costs for all budget tiers for a country
 * @param country Country data
 * @param distanceKm Flight distance in kilometers
 * @returns Cost breakdowns for all three tiers
 */
export function calculateCosts(
  country: Country,
  distanceKm: number
): Record<BudgetTier, CostBreakdown> {
  const baseFlight = distanceKm * 0.10; // $0.10 per km base rate
  const baseHotel = country.nightlyCost;
  const baseDaily = country.baselineCost / 3;

  const result: Record<BudgetTier, CostBreakdown> = {} as Record<
    BudgetTier,
    CostBreakdown
  >;

  for (const tier of ['budget', 'modest', 'bougie'] as BudgetTier[]) {
    const multiplier = TIER_MULTIPLIERS[tier];
    const flight = Math.round(baseFlight * multiplier);
    const hotel = Math.round(baseHotel * multiplier);
    const daily = Math.round(baseDaily * multiplier);
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
