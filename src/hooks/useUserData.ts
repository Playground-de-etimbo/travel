import { useState, useEffect, useCallback, useRef } from 'react';
import { LocalStorageAdapter } from '@/lib/storage';
import type { UserData } from '@/types';

const storage = new LocalStorageAdapter();
const VERSION = '1.0';

export function useUserData() {
  const [beenTo, setBeenTo] = useState<string[]>([]);
  const [wantToGo, setWantToGo] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Refs mirror state so callbacks stay stable (no beenTo/wantToGo in deps)
  const beenToRef = useRef(beenTo);
  beenToRef.current = beenTo;
  const wantToGoRef = useRef(wantToGo);
  wantToGoRef.current = wantToGo;

  // Load data from storage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await storage.load();
        if (data) {
          setBeenTo(data.beenTo || []);
          setWantToGo(data.wantToGo || []);
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Save to storage whenever data changes
  const saveData = useCallback(async (newBeenTo: string[], newWantToGo: string[]) => {
    try {
      const userData: UserData = {
        beenTo: newBeenTo,
        wantToGo: newWantToGo,
        lastUpdated: new Date(),
        version: VERSION,
      };
      await storage.save(userData);
    } catch (error) {
      console.error('Failed to save user data:', error);
      throw error;
    }
  }, []);

  const addCountry = useCallback(async (countryCode: string) => {
    if (beenToRef.current.includes(countryCode)) {
      return;
    }
    const newBeenTo = [...beenToRef.current, countryCode];
    setBeenTo(newBeenTo);
    await saveData(newBeenTo, wantToGoRef.current);
  }, [saveData]);

  const removeCountry = useCallback(async (countryCode: string) => {
    const newBeenTo = beenToRef.current.filter(code => code !== countryCode);
    setBeenTo(newBeenTo);
    await saveData(newBeenTo, wantToGoRef.current);
  }, [saveData]);

  const clearAll = useCallback(async () => {
    setBeenTo([]);
    setWantToGo([]);
    await storage.clear();
  }, []);

  return {
    beenTo,
    wantToGo,
    loading,
    addCountry,
    removeCountry,
    clearAll,
  };
}
