import { useState, useEffect, useCallback } from 'react';
import { X, Stamp, Compass } from 'lucide-react';

// Header sits at absolute top-6 (24px) and is ~56px tall → clears at ~80px.
// Banner starts well below the header, then slides up to near the top as user scrolls.
const RESTING_TOP = 96; // px – initial position below header
const SCROLLED_TOP = 12; // px – snug to top once header is out of view
const SCROLL_RANGE = 120; // px of scroll over which the transition happens

interface SharedPostcardBannerProps {
  name: string;
  countryCount: number;
  onViewPostcard: () => void;
  onDismiss: () => void;
}

export const SharedPostcardBanner = ({
  name,
  countryCount,
  onViewPostcard,
  onDismiss,
}: SharedPostcardBannerProps) => {
  const [hidden, setHidden] = useState(false);
  const [entered, setEntered] = useState(false);
  const [topPx, setTopPx] = useState(RESTING_TOP);

  // Animate in on mount
  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Track scroll to slide banner upward as header leaves viewport
  const handleScroll = useCallback(() => {
    const t = Math.min(window.scrollY / SCROLL_RANGE, 1);
    setTopPx(RESTING_TOP - t * (RESTING_TOP - SCROLLED_TOP));
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Hide when any input is focused (mobile keyboard) and restore when blurred
  useEffect(() => {
    const onFocusIn = (e: FocusEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        setHidden(true);
      }
    };
    const onFocusOut = (e: FocusEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        setHidden(false);
      }
    };
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('focusout', onFocusOut);
    return () => {
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('focusout', onFocusOut);
    };
  }, []);

  const isVisible = entered && !hidden;

  return (
    <div
      className="fixed inset-x-0 z-50 flex justify-center pointer-events-none"
      style={{ top: `${topPx}px` }}
    >
      <div
        className={`
          pointer-events-auto
          flex items-center gap-2 sm:gap-3
          pl-3 pr-1.5 sm:pl-4 sm:pr-2 py-1.5
          bg-background/90 backdrop-blur-md
          border border-border rounded-full shadow-lg
          transition-all duration-300 ease-out
          ${isVisible
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4'}
        `}
      >
        {/* Sharer info */}
        <span className="text-xs sm:text-sm font-semibold text-foreground truncate max-w-[140px] sm:max-w-none">
          {name}&apos;s Postcard
        </span>
        <span className="hidden sm:inline text-xs text-muted-foreground">
          {countryCount} {countryCount === 1 ? 'country' : 'countries'}
        </span>

        {/* Divider */}
        <span className="w-px h-4 bg-border" />

        {/* View Postcard */}
        <button
          onClick={onViewPostcard}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold bg-accent text-accent-foreground transition-colors hover:bg-accent/80"
        >
          <Stamp className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">View Postcard</span>
          <span className="sm:hidden">View</span>
        </button>

        {/* Start My Journey */}
        <button
          onClick={onDismiss}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Compass className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Start My Journey</span>
          <span className="sm:hidden">My Map</span>
        </button>

        {/* Dismiss */}
        <button
          onClick={onDismiss}
          className="rounded-full p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
