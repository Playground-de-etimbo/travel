import type { UserData } from '@/types';
import type { StorageAdapter } from './interface';

/**
 * FirestoreAdapter - Implementation for post-MVP (v1.1+)
 * Will be implemented when Firebase Authentication is added
 */
export class FirestoreAdapter implements StorageAdapter {
  async load(): Promise<UserData | null> {
    throw new Error('Firestore adapter not yet implemented (v1.1+)');
  }

  async save(_data: UserData): Promise<void> {
    throw new Error('Firestore adapter not yet implemented (v1.1+)');
  }

  async update(_partial: Partial<UserData>): Promise<void> {
    throw new Error('Firestore adapter not yet implemented (v1.1+)');
  }

  async clear(): Promise<void> {
    throw new Error('Firestore adapter not yet implemented (v1.1+)');
  }

  async exists(): Promise<boolean> {
    throw new Error('Firestore adapter not yet implemented (v1.1+)');
  }

  async export(): Promise<string> {
    throw new Error('Firestore adapter not yet implemented (v1.1+)');
  }

  async import(_json: string): Promise<void> {
    throw new Error('Firestore adapter not yet implemented (v1.1+)');
  }
}
