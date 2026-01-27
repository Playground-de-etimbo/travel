export interface UserData {
  beenTo: string[];            // Array of country codes
  wantToGo: string[];          // Array of country codes
  lastUpdated: Date;
  version: string;             // Data version for migrations
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  displayCurrency: string;     // ISO 4217 code for display
}
