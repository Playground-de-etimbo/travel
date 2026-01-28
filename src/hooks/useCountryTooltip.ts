import { useState, useCallback } from 'react';
import type { Country } from '@/types';

interface TooltipState {
  country: Country | null;
  position: { x: number; y: number };
  visible: boolean;
}

export function useCountryTooltip() {
  const [tooltip, setTooltip] = useState<TooltipState>({
    country: null,
    position: { x: 0, y: 0 },
    visible: false,
  });

  const show = useCallback((country: Country, x: number, y: number) => {
    setTooltip({
      country,
      position: { x, y },
      visible: true,
    });
  }, []);

  const hide = useCallback(() => {
    setTooltip(prev => ({
      ...prev,
      visible: false,
    }));
  }, []);

  const update = useCallback((x: number, y: number) => {
    setTooltip(prev => ({
      ...prev,
      position: { x, y },
    }));
  }, []);

  return { tooltip, show, hide, update };
}
