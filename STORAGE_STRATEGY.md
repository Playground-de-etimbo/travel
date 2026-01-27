# Storage Strategy & Migration Plan

## Overview
This document explains our storage approach: start with localStorage for MVP, then migrate to Firebase when authentication is added.

---

## MVP: localStorage Only

### Why localStorage First?
- ✅ **Simple:** No backend setup, no auth required
- ✅ **Fast:** Synchronous API, instant saves
- ✅ **Offline:** Works without internet
- ✅ **Free:** No costs or quotas
- ⚠️ **Limited:** Per-device only, ~5-10MB storage

### What We Store
```json
{
  "beenTo": ["US", "CA", "MX", "JP"],
  "wantToGo": ["FR", "IT", "ES", "AU"],
  "lastUpdated": "2026-01-27T12:00:00Z",
  "version": "1.0"
}
```

---

## Storage Abstraction Layer

### The Pattern
Create an interface that both localStorage and Firestore can implement. This makes migration seamless.

### Interface Definition
```typescript
// src/lib/storage/interface.ts

export interface UserData {
  beenTo: string[];         // Array of country codes
  wantToGo: string[];       // Array of country codes
  lastUpdated: Date;
  version: string;
}

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
```

---

## MVP Implementation: localStorage

### localStorage Adapter
```typescript
// src/lib/storage/localStorage.ts

const STORAGE_KEY = 'travel_planner_data';

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
```

---

## Post-MVP Implementation: Firestore

### Firestore Adapter (v1.1+)
```typescript
// src/lib/storage/firestore.ts

import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

export class FirestoreAdapter implements StorageAdapter {
  private getUserDoc() {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error('User not authenticated');
    return doc(db, 'users', userId);
  }

  async load(): Promise<UserData | null> {
    try {
      const userDoc = this.getUserDoc();
      const snapshot = await getDoc(userDoc);

      if (!snapshot.exists()) return null;

      const data = snapshot.data();
      return {
        ...data,
        lastUpdated: data.lastUpdated.toDate(),
      } as UserData;
    } catch (error) {
      console.error('Failed to load from Firestore:', error);
      return null;
    }
  }

  async save(data: UserData): Promise<void> {
    try {
      const userDoc = this.getUserDoc();
      await setDoc(userDoc, {
        ...data,
        lastUpdated: new Date(),
      });
    } catch (error) {
      console.error('Failed to save to Firestore:', error);
      throw error;
    }
  }

  async update(partial: Partial<UserData>): Promise<void> {
    try {
      const userDoc = this.getUserDoc();
      await updateDoc(userDoc, {
        ...partial,
        lastUpdated: new Date(),
      });
    } catch (error) {
      console.error('Failed to update Firestore:', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    await this.save({
      beenTo: [],
      wantToGo: [],
      lastUpdated: new Date(),
      version: '1.0',
    });
  }

  async exists(): Promise<boolean> {
    const data = await this.load();
    return data !== null;
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
```

---

## Active Adapter Selection

### Centralized Export
```typescript
// src/lib/storage/index.ts

import { LocalStorageAdapter } from './localStorage';
import { FirestoreAdapter } from './firestore';
import type { StorageAdapter } from './interface';

// Feature flag or environment variable
const USE_FIRESTORE = import.meta.env.VITE_USE_FIRESTORE === 'true';

// Export the active adapter
export const storage: StorageAdapter = USE_FIRESTORE
  ? new FirestoreAdapter()
  : new LocalStorageAdapter();

// Also export types
export type { StorageAdapter, UserData } from './interface';
```

---

## Usage in Components

### Using the Storage Adapter
```typescript
// src/hooks/useUserState.ts

import { storage } from '@/lib/storage';

export const useUserState = () => {
  const [beenTo, setBeenTo] = useState<string[]>([]);
  const [wantToGo, setWantToGo] = useState<string[]>([]);

  // Load on mount
  useEffect(() => {
    const loadData = async () => {
      const data = await storage.load();
      if (data) {
        setBeenTo(data.beenTo);
        setWantToGo(data.wantToGo);
      }
    };
    loadData();
  }, []);

  // Auto-save on changes (debounced)
  useEffect(() => {
    const saveData = async () => {
      await storage.save({
        beenTo,
        wantToGo,
        lastUpdated: new Date(),
        version: '1.0',
      });
    };

    const timeout = setTimeout(saveData, 500); // Debounce 500ms
    return () => clearTimeout(timeout);
  }, [beenTo, wantToGo]);

  // Toggle functions
  const toggleBeenTo = (countryCode: string) => {
    setBeenTo((prev) =>
      prev.includes(countryCode)
        ? prev.filter((c) => c !== countryCode)
        : [...prev, countryCode]
    );
  };

  const toggleWantToGo = (countryCode: string) => {
    setWantToGo((prev) =>
      prev.includes(countryCode)
        ? prev.filter((c) => c !== countryCode)
        : [...prev, countryCode]
    );
  };

  return { beenTo, wantToGo, toggleBeenTo, toggleWantToGo };
};
```

---

## Migration from localStorage to Firestore (v1.1)

### One-Time Sync on First Sign-In
```typescript
// src/lib/storage/migration.ts

import { LocalStorageAdapter } from './localStorage';
import { FirestoreAdapter } from './firestore';

export async function migrateLocalStorageToFirestore(): Promise<void> {
  const localAdapter = new LocalStorageAdapter();
  const firestoreAdapter = new FirestoreAdapter();

  try {
    // Check if localStorage has data
    const localData = await localAdapter.load();
    if (!localData) {
      console.log('No localStorage data to migrate');
      return;
    }

    // Check if Firestore already has data
    const firestoreData = await firestoreAdapter.load();
    if (firestoreData) {
      console.log('Firestore already has data, skipping migration');
      return;
    }

    // Migrate
    console.log('Migrating localStorage to Firestore...');
    await firestoreAdapter.save(localData);

    // Keep localStorage as backup
    console.log('Migration complete!');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}
```

### Trigger Migration on First Sign-In
```typescript
// In AuthContext or sign-in handler

const handleSignIn = async () => {
  await signInWithGoogle();

  // After successful sign-in
  await migrateLocalStorageToFirestore();

  // Switch to Firestore adapter
  // (or set environment variable and reload)
};
```

---

## Conflict Resolution (Advanced)

If a user has both localStorage and Firestore data (e.g., used on multiple devices):

### Merge Strategy
```typescript
export async function mergeData(
  local: UserData,
  remote: UserData
): Promise<UserData> {
  // Combine arrays, remove duplicates
  const mergedBeenTo = [...new Set([...local.beenTo, ...remote.beenTo])];
  const mergedWantToGo = [...new Set([...local.wantToGo, ...remote.wantToGo])];

  // Use latest timestamp
  const lastUpdated =
    local.lastUpdated > remote.lastUpdated
      ? local.lastUpdated
      : remote.lastUpdated;

  return {
    beenTo: mergedBeenTo,
    wantToGo: mergedWantToGo,
    lastUpdated,
    version: '1.0',
  };
}
```

---

## Benefits of This Approach

### ✅ Pros
1. **MVP ships faster** - No Firebase setup needed initially
2. **Easier to test** - No auth flows to debug early on
3. **Clean separation** - Storage logic isolated from UI
4. **Seamless migration** - Change one line to switch adapters
5. **Type safety** - TypeScript ensures correct implementation
6. **Testable** - Easy to mock storage in tests

### ⚠️ Trade-offs
1. **Extra abstraction** - Slightly more code upfront
2. **localStorage limits** - ~5-10MB (fine for our use case)
3. **No cross-device sync** - Until auth is added

---

## Testing Strategy

### Mock Adapter for Tests
```typescript
// src/lib/storage/__mocks__/mockStorage.ts

export class MockStorageAdapter implements StorageAdapter {
  private data: UserData | null = null;

  async load() {
    return this.data;
  }

  async save(data: UserData) {
    this.data = data;
  }

  async clear() {
    this.data = null;
  }

  // ... other methods
}
```

### Use in Tests
```typescript
import { MockStorageAdapter } from '@/lib/storage/__mocks__/mockStorage';

test('toggleBeenTo adds country', async () => {
  const mockStorage = new MockStorageAdapter();
  // ... test with mockStorage
});
```

---

## Summary

**MVP (v1.0):** localStorage only
- Fast to build
- Works offline
- No auth needed

**Post-MVP (v1.1):** Add Firestore
- Change one config line
- Migrate existing users automatically
- Cross-device sync

**Key:** Abstraction layer makes migration trivial. Build once, switch adapters later.

---

Last updated: 2026-01-27
