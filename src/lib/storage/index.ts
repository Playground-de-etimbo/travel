import { LocalStorageAdapter } from './localStorage';
import type { StorageAdapter } from './interface';

// Storage adapter — currently uses localStorage
export const storage: StorageAdapter = new LocalStorageAdapter();

// Re-export types and classes
export type { StorageAdapter } from './interface';
export { LocalStorageAdapter };
