import { useState, useEffect } from 'react';
import { decodePostcardUrl } from '@/lib/postcard/shareUrl';

export function useSharedPostcard() {
  const [sharedPostcard, setSharedPostcard] = useState<{
    name: string;
    beenTo: string[];
  } | null>(null);

  useEffect(() => {
    const result = decodePostcardUrl(window.location.href);
    if (result) {
      setSharedPostcard(result);
      // Clean URL without reload
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const clearSharedPostcard = () => setSharedPostcard(null);

  return { sharedPostcard, clearSharedPostcard };
}
