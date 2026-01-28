import { LocalStorageAdapter } from './localStorage';
import type { StorageAdapter } from './interface';

// For MVP, always use localStorage
// In v1.1+, switch based on auth state
export const storage: StorageAdapter = new LocalStorageAdapter();

// Re-export types and classes
export type { StorageAdapter } from './interface';
export { LocalStorageAdapter };
