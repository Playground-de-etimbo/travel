import type { Country } from '@/types/country';
import type {
  CountryRecommendation,
  FlightDuration,
  RecommendationPreferences,
} from '@/types/recommendation';
import { getCountryCoordinates } from '@/data/countryCoordinates';
import {
  calculateDistance,
  estimateFlightHours,
} from './distanceCalculator';
import { calculateCosts } from './costCalculator';
import { generateReason } from './reasonGenerator';
import { generateVerbsForBatch } from './verbGenerator';

/**
 * Flight duration thresholds in hours
 */
const DURATION_LIMITS: Record<FlightDuration, number> = {
  'under-3': 3,
  '3-6': 6,
  '6-12': 12,
  '12-plus': Infinity,
};

interface ScoredCountry {
  country: Country;
  score: number;
  distance: number;
}

/**
 * Generate travel recommendations based on user preferences
 */
export async function generateRecommendations(
  preferences: RecommendationPreferences,
  allCountries: Country[],
  beenTo: string[]
): Promise<CountryRecommendation[]> {
  const { homeLocation, interests, maxFlightDuration } = preferences;

  if (!homeLocation) {
    throw new Error('Home location is required');
  }

  const homeCoords = getCountryCoordinates(homeLocation);
  if (!homeCoords) {
    throw new Error(
      `Unable to find coordinates for selected country (${homeLocation}). Please try selecting a different country.`
    );
  }

  // Step 1: Filter candidates
  const candidates = allCountries.filter((country) => {
    // Exclude home and visited countries
    if (country.countryCode === homeLocation || beenTo.includes(country.countryCode)) {
      return false;
    }

    // Must have coordinate data
    const coords = getCountryCoordinates(country.countryCode);
    if (!coords) {
      return false;
    }

    // Calculate distance and check flight duration
    const distance = calculateDistance(
      homeCoords.lat,
      homeCoords.lng,
      coords.lat,
      coords.lng
    );
    const flightHours = estimateFlightHours(distance);
    const maxHours = DURATION_LIMITS[maxFlightDuration];

    return flightHours <= maxHours;
  });

  if (candidates.length === 0) {
    throw new Error('No countries found matching your criteria');
  }

  // Step 2: Score each candidate
  const scored: ScoredCountry[] = candidates.map((country) => {
    const coords = getCountryCoordinates(country.countryCode)!;
    const distance = calculateDistance(
      homeCoords.lat,
      homeCoords.lng,
      coords.lat,
      coords.lng
    );
    const flightHours = estimateFlightHours(distance);

    let score = 50; // Base score

    // Interest matching: +10 per matched interest using country data
    // Countries now have interests defined in their data (e.g., ['weather', 'culture'])
    interests.forEach((interest) => {
      if (country.interests?.includes(interest)) {
        score += 10;
      }
    });

    // Distance bonus: prefer 4-10 hour flights (+15 points)
    if (flightHours >= 4 && flightHours <= 10) {
      score += 15;
    }

    // Random variance: ±10 points for variety across generations
    // This ensures the same preferences produce different results each time
    score += Math.floor(Math.random() * 21) - 10; // -10 to +10

    return { country, score, distance };
  });

  // Step 3: Sort by score and select top candidates
  // Expanded pool from 12 to 25 for much more variety
  scored.sort((a, b) => b.score - a.score);
  const topCandidates = scored.slice(0, 25);

  // Apply variety filter (max 3 per region)
  const regionCounts: Record<string, number> = {};
  const varietyFiltered = topCandidates.filter((item) => {
    const region = item.country.region;
    regionCounts[region] = (regionCounts[region] || 0) + 1;
    return regionCounts[region] <= 3;
  });

  // Randomly select 6-8 from filtered candidates
  const targetCount = Math.min(
    Math.floor(Math.random() * 3) + 6, // 6-8
    varietyFiltered.length
  );
  const shuffled = varietyFiltered.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, targetCount);

  // Step 4: Generate recommendations with costs and reasons
  const recommendations: CountryRecommendation[] = await Promise.all(
    selected.map(async (item) => {
      const costs = await calculateCosts(item.country, item.distance);
      const reason = generateReason(item.country.countryName, interests);

      return {
        countryCode: item.country.countryCode,
        reason,
        imageUrl: null, // Will be populated by API call
        imagePhotographerName: null, // Will be populated by API call
        matchScore: Math.round(item.score),
        costs,
        actionVerb: '', // Will be assigned below
      };
    })
  );

  // Step 5: Assign playful verbs (no repeats in batch)
  const countriesForVerbs = selected.map((item) => ({
    countryCode: item.country.countryCode,
    region: item.country.region,
  }));
  const verbs = generateVerbsForBatch(countriesForVerbs);

  recommendations.forEach((rec, index) => {
    rec.actionVerb = verbs[index];
  });

  // Step 6: Sort by match score (highest first)
  recommendations.sort((a, b) => b.matchScore - a.matchScore);

  return recommendations;
}
