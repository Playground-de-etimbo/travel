export type BudgetTier = 'budget' | 'modest' | 'bougie';
export type TravelInterest = 'weather' | 'relaxation' | 'culture' | 'action';
export type FlightDuration = 'under-3' | '3-6' | '6-12' | '12-plus';

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

export interface CountryRecommendation {
  countryCode: string;
  reason: string;                       // Personalized reason
  imageUrl: string | null;              // Unsplash URL
  matchScore: number;                   // 0-100 relevance
  costs: {
    budget: CostBreakdown;
    modest: CostBreakdown;
    bougie: CostBreakdown;
  };
}

export interface RecommendationResult {
  recommendations: CountryRecommendation[];
  preferences: RecommendationPreferences;
  generatedAt: Date;
  version: string;
}
