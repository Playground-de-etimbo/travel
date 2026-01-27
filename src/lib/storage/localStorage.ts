import type { UserData } from '@/types';
import type { StorageAdapter } from './interface';

const STORAGE_KEY = 'travel_planner_data';
const VERSION = '1.0';

export class LocalStorageAdapter implements StorageAdapter {
  async load(): Promise<UserData | null> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;

      const parsed = JSON.parse(raw);
      return {
        ...parsed,
        lastUpdated: new Date(parsed.lastUpdated),
      };
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return null;
    }
  }

  async save(data: UserData): Promise<void> {
    try {
      const serialized = JSON.stringify({
        ...data,
        lastUpdated: data.lastUpdated.toISOString(),
      });
      localStorage.setItem(STORAGE_KEY, serialized);
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      throw error;
    }
  }

  async update(partial: Partial<UserData>): Promise<void> {
    const current = await this.load();
    const updated = {
      beenTo: [],
      wantToGo: [],
      version: VERSION,
      ...current,
      ...partial,
      lastUpdated: new Date(),
    };
    await this.save(updated as UserData);
  }

  async clear(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY);
  }

  async exists(): Promise<boolean> {
    return localStorage.getItem(STORAGE_KEY) !== null;
  }

  async export(): Promise<string> {
    const data = await this.load();
    return JSON.stringify(data, null, 2);
  }

  async import(json: string): Promise<void> {
    const data = JSON.parse(json);
    await this.save(data);
  }
}
