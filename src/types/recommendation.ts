import type { TravelInterest } from './country';

export type BudgetTier = 'budget' | 'modest' | 'bougie';
export type FlightDuration = 'under-3' | '3-6' | '6-12' | '12-plus';
export type { TravelInterest };

export interface RecommendationPreferences {
  homeLocation: string | null;          // Country code
  interests: TravelInterest[];
  maxFlightDuration: FlightDuration;
  lastGenerated: Date | null;
}

export interface CostBreakdown {
  flight: number;                       // Round-trip
  hotel: number;                        // Per night
  daily: number;                        // Food, activities, transport per day
  total: number;                        // 7-day trip total
}

export interface CountryEnrichedData {
  currency: string;                     // e.g., "JPY" (ISO 4217)
  language: string;                     // e.g., "Japanese" or "who knows what"
  demonym: string;                      // e.g., "Australians", "Japanese"
  capital: string | null;               // e.g., "Tokyo" or null if unknown
}

export interface CountryRecommendation {
  countryCode: string;
  reason: string;                       // Personalized reason
  imageUrl: string | null;              // Unsplash URL
  imagePhotographerName?: string | null; // Unsplash photographer for tooltip attribution
  matchScore: number;                   // 0-100 relevance
  costs: {
    budget: CostBreakdown;
    modest: CostBreakdown;
    bougie: CostBreakdown;
  };
  enrichedData?: CountryEnrichedData | null; // undefined = not fetched, null = loading, object = loaded
  actionVerb: string;                   // Playful verb for display (e.g., "Adventure", "Frolic")
}

export interface RecommendationResult {
  recommendations: CountryRecommendation[];
  preferences: RecommendationPreferences;
  generatedAt: Date;
  version: string;
}
