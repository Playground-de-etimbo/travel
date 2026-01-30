import { useState, useEffect, useCallback } from 'react';

interface UseScrollExpansionOptions {
  minHeight: number; // Minimum height in vh
  maxHeight: number; // Maximum height in vh
  expansionScrollRange: number; // Scroll distance (px) for full expansion
}

interface UseScrollExpansionReturn {
  currentHeight: number; // Current height in vh
  expansion: number; // Expansion progress (0-1)
  isExpanded: boolean; // True when at max height
}

export function useScrollExpansion({
  minHeight,
  maxHeight,
  expansionScrollRange,
}: UseScrollExpansionOptions): UseScrollExpansionReturn {
  const [currentHeight, setCurrentHeight] = useState(minHeight);
  const [expansion, setExpansion] = useState(0);

  const handleScroll = useCallback(() => {
    // Use RAF to throttle to 60fps max
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const progress = Math.min(scrollY / expansionScrollRange, 1);
      const newHeight = minHeight + (maxHeight - minHeight) * progress;

      setCurrentHeight(newHeight);
      setExpansion(progress);
    });
  }, [minHeight, maxHeight, expansionScrollRange]);

  useEffect(() => {
    // Use passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial calculation
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // Handle window resize (orientation change)
  useEffect(() => {
    const handleResize = () => {
      // Recalculate on resize
      handleScroll();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleScroll]);

  return {
    currentHeight,
    expansion,
    isExpanded: expansion >= 1,
  };
}
