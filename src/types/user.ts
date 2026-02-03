import type { RecommendationResult } from './recommendation';

export interface UserData {
  beenTo: string[];            // Array of country codes
  wantToGo: string[];          // Array of country codes
  lastUpdated: Date;
  version: string;             // Data version for migrations
  recommendations?: RecommendationResult;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  displayCurrency: string;     // ISO 4217 code for display
  recommendations?: {
    detectedCountry: string | null;      // Auto-detected country code
    budgetTier: 'budget' | 'modest' | 'bougie';  // Selected budget tier
    detectionDismissed: boolean;         // Whether user dismissed detection badge
  };
}
