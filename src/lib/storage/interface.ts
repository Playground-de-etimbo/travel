import type { UserData } from '@/types';

export interface StorageAdapter {
  // Load user data
  load(): Promise<UserData | null>;

  // Save user data
  save(data: UserData): Promise<void>;

  // Update specific fields
  update(partial: Partial<UserData>): Promise<void>;

  // Clear all data
  clear(): Promise<void>;

  // Check if data exists
  exists(): Promise<boolean>;

  // Export data as JSON (for backup)
  export(): Promise<string>;

  // Import data from JSON
  import(json: string): Promise<void>;
}
