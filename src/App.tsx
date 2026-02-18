import { useState, useCallback, useMemo, useRef, lazy, Suspense } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Toaster } from '@/components/ui/sonner';
import { SearchPanel } from '@/components/search/SearchPanel';
import { MobileSearchPanel } from '@/components/search/MobileSearchPanel';
import { FloatingPillNav } from '@/components/layout/FloatingPillNav';

// Lazy-load heavy below-fold components to reduce initial bundle size
const WorldMap = lazy(() => import('@/components/map/WorldMap'));
const RecommendationsSection = lazy(() => import('@/components/recommendations/RecommendationsSection'));
const PostcardSection = lazy(() => import('@/components/postcard/PostcardSection'));
import { TechStackSection } from '@/components/footer/TechStackSection';
import { CountriesNote } from '@/components/footer/CountriesNote';
import { PortfolioFooter } from '@/components/footer/PortfolioFooter';
import { SharedPostcardBanner } from '@/components/postcard/SharedPostcardBanner';
import { StartOwnJourneyModal } from '@/components/postcard/StartOwnJourneyModal';
import { useCountries } from '@/hooks/useCountries';
import { useUserData } from '@/hooks/useUserData';
import { useSharedPostcard } from '@/hooks/useSharedPostcard';
import { setSoundMuted } from '@/lib/sound/countrySounds';

function App() {
  const { countries } = useCountries();
  const { beenTo, addCountry, removeCountry, clearAll } = useUserData();
  const { sharedPostcard, clearSharedPostcard } = useSharedPostcard();
  const [soundMuted, setSoundMutedState] = useState(false);
  const [panTarget, setPanTarget] = useState<string | null>(null);
  const [showStartOwnModal, setShowStartOwnModal] = useState(false);
  const pendingCountryRef = useRef<string | null>(null);
  const sharedPostcardRef = useRef(sharedPostcard);
  sharedPostcardRef.current = sharedPostcard;

  // Stable callback - prevents Header re-renders when App re-renders
  const handleToggleSound = useCallback(() => {
    setSoundMutedState((prev) => {
      const next = !prev;
      setSoundMuted(next);
      return next;
    });
  }, []);

  // Intercept add when viewing shared postcard — show modal instead
  const handleAddCountry = useCallback((code: string) => {
    if (sharedPostcardRef.current) {
      pendingCountryRef.current = code;
      setShowStartOwnModal(true);
      return;
    }
    addCountry(code);
  }, [addCountry]);

  // Intercept remove when viewing shared postcard — show modal instead
  const handleRemoveCountry = useCallback((code: string) => {
    if (sharedPostcardRef.current) {
      pendingCountryRef.current = null;
      setShowStartOwnModal(true);
      return;
    }
    removeCountry(code);
  }, [removeCountry]);

  const handleAddCountryFromSearch = useCallback((code: string) => {
    if (sharedPostcardRef.current) {
      pendingCountryRef.current = code;
      setShowStartOwnModal(true);
      return;
    }
    addCountry(code);
    setPanTarget(code);
    setTimeout(() => setPanTarget(null), 100);
  }, [addCountry]);

  const handleConfirmStartOwn = useCallback(() => {
    const pending = pendingCountryRef.current;
    clearSharedPostcard();
    setShowStartOwnModal(false);
    if (pending) {
      addCountry(pending);
      setPanTarget(pending);
      setTimeout(() => setPanTarget(null), 100);
    }
    pendingCountryRef.current = null;
  }, [clearSharedPostcard, addCountry]);

  const handleClaimMap = useCallback(() => {
    const shared = sharedPostcardRef.current;
    const pending = pendingCountryRef.current;
    clearSharedPostcard();
    setShowStartOwnModal(false);
    // Copy all shared countries to the user's map
    if (shared) {
      for (const code of shared.beenTo) {
        addCountry(code);
      }
    }
    // Also add the country they were trying to select
    if (pending && !shared?.beenTo.includes(pending)) {
      addCountry(pending);
    }
    pendingCountryRef.current = null;
  }, [clearSharedPostcard, addCountry]);

  const handleCancelStartOwn = useCallback(() => {
    setShowStartOwnModal(false);
    pendingCountryRef.current = null;
  }, []);

  const handleViewSharedPostcard = useCallback(() => {
    document.getElementById('passport')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Memoize the effective beenTo list — avoids inline ternary in 4 places
  const effectiveBeenTo = useMemo(
    () => sharedPostcard ? sharedPostcard.beenTo : beenTo,
    [sharedPostcard, beenTo]
  );

  // Stable starfield positions — computed once, never recomputed on re-render
  const starPositions = useMemo(() =>
    Array.from({ length: 30 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 60}%`,
      animationDelay: `${Math.random() * 3}s`,
      opacity: Math.random() * 0.7 + 0.3,
    })),
  []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Header
        soundMuted={soundMuted}
        onToggleSound={handleToggleSound}
        onClearSession={clearAll}
      />
      <Toaster />
      {sharedPostcard && (
        <SharedPostcardBanner
          name={sharedPostcard.name}
          countryCount={sharedPostcard.beenTo.length}
          onViewPostcard={handleViewSharedPostcard}
          onDismiss={clearSharedPostcard}
        />
      )}
      {/* Router wrapper is intentionally disabled while app is single-route. */}
      <main>
              {/* Map Hero Section - Full viewport interactive map */}
              <section id="map-hero" className="relative">
                <Suspense fallback={<div className="h-[85vh] max-h-screen bg-gradient-to-b from-card to-background" />}>
                  <WorldMap
                    beenTo={effectiveBeenTo}
                    onAddCountry={handleAddCountry}
                    onRemoveCountry={handleRemoveCountry}
                    panToCountryCode={panTarget}
                  />
                </Suspense>
              </section>

              {/* Sky Wrapper - Contains search and recommendations with sunset background */}
              <div className="relative sky-wrapper">
                {/* Gradient starts from specific point, not top of wrapper */}
                <div className="absolute inset-0 sky-gradient" style={{ top: '12rem' }} />

                {/* Celestial Body - Sun in light mode, Moon in dark mode */}
                <div className="celestial-body absolute pointer-events-none" style={{ top: 'calc(12rem + 8%)' }}>
                  {/* Light mode: Sun with glow */}
                  <div className="sun-element">
                    <div className="sun-core" />
                  </div>

                  {/* Dark mode: Moon with craters */}
                  <div className="moon-element">
                    <div className="moon-surface">
                      {/* Moon craters for realism */}
                      <div className="crater crater-1" />
                      <div className="crater crater-2" />
                      <div className="crater crater-3" />
                    </div>
                  </div>
                </div>

                {/* Starfield for dark mode */}
                <div className="starfield absolute pointer-events-none opacity-0 dark:opacity-100" style={{ top: '12rem' }}>
                  {starPositions.map((star, i) => (
                    <div
                      key={i}
                      className="star"
                      style={star}
                    />
                  ))}
                </div>

                {/* Search Panel - Desktop sticky panel overlapping map */}
                <SearchPanel
                  beenTo={effectiveBeenTo}
                  countries={countries}
                  onAddCountry={handleAddCountryFromSearch}
                  onRemoveCountry={handleRemoveCountry}
                />

                {/* Mobile Search Panel - Fixed bottom panel with scroll expansion */}
                <MobileSearchPanel
                  beenTo={effectiveBeenTo}
                  countries={countries}
                  onAddCountry={handleAddCountryFromSearch}
                  onRemoveCountry={handleRemoveCountry}
                />

                {/* Recommendations Section */}
                <Suspense fallback={<div style={{ minHeight: '600px' }} />}>
                  <RecommendationsSection
                    countries={countries}
                    beenTo={effectiveBeenTo}
                    addCountry={addCountry}
                  />
                </Suspense>
              </div>

              {/* Travel Passport / Postcard Section */}
              <Suspense fallback={<div className="py-16 border-t border-border" style={{ minHeight: '800px' }} />}>
                <PostcardSection
                  countries={countries}
                  beenTo={beenTo}
                  sharedName={sharedPostcard?.name}
                  sharedBeenTo={sharedPostcard?.beenTo}
                />
              </Suspense>

              {/* Bottom Sections: Tech Stack + Countries Note */}
              <section id="about" className="py-16 border-t border-border">
                <div className="container mx-auto px-4">
                  {/* Two-column layout on desktop, stacked on mobile */}
                  <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 lg:gap-16">
                    {/* Left: Tech Stack (60% width on desktop) */}
                    <div>
                      <TechStackSection />
                    </div>

                    {/* Right: Countries Note (40% width on desktop) */}
                    <div>
                      <CountriesNote />
                    </div>
                  </div>
                </div>
              </section>

              {/* Portfolio Footer */}
              <PortfolioFooter />

              {/* Directory Section */}
              <section id="directory" className="py-16 border-t border-border">
                <div className="container mx-auto px-4">
                  <div className="mb-8">
                    <span className="eyebrow-directory text-sm font-semibold uppercase tracking-wider block">
                      Explore The World
                    </span>
                    <h2 className="text-5xl font-extrabold mt-4 mb-2 tracking-tight leading-tight text-foreground">
                      Country Directory
                    </h2>
                    <p className="text-base text-muted-foreground max-w-xl">
                      Browse 195 countries, territories, and destinations waiting to be discovered
                    </p>
                  </div>
                  <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                      Country cards and search coming soon
                    </CardContent>
                  </Card>
                </div>
              </section>

              {/* Want To Go Section */}
              <section id="want-to-go" className="py-16 border-t border-border">
                <div className="container mx-auto px-4">
                  <div className="mb-8">
                    <span className="eyebrow-wanttogo text-sm font-semibold uppercase tracking-wider block">
                      Dream Destinations
                    </span>
                    <h2 className="text-5xl font-extrabold mt-4 mb-2 tracking-tight leading-tight text-foreground">
                      Want To Go
                    </h2>
                    <p className="text-base text-muted-foreground max-w-xl">
                      Build your travel bucket list. The world is waiting for you.
                    </p>
                  </div>
                  <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                      Countries you want to visit will appear here
                    </CardContent>
                  </Card>
                </div>
              </section>

              {/* Stats Section */}
              <section id="stats" className="py-16 border-t border-border">
                <div className="container mx-auto px-4">
                  <div className="mb-8">
                    <span className="eyebrow-stats text-sm font-semibold uppercase tracking-wider block">
                      Travel Intelligence
                    </span>
                    <h2 className="text-5xl font-extrabold mt-4 mb-4 tracking-tight leading-tight text-foreground">
                      Your Travel Stats
                    </h2>
                    <p className="text-base text-muted-foreground max-w-xl">
                      Compare your journey to global averages and see how you stack up
                    </p>
                  </div>
                  <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                      Statistics and comparisons coming soon
                    </CardContent>
                  </Card>
                </div>
              </section>

        {/* Floating Pill Navigation */}
        <FloatingPillNav />
      </main>

      {/* Modal: user tries to interact while viewing shared postcard */}
      <StartOwnJourneyModal
        open={showStartOwnModal}
        sharerName={sharedPostcard?.name ?? ''}
        onConfirm={handleConfirmStartOwn}
        onClaimMap={handleClaimMap}
        onCancel={handleCancelStartOwn}
      />
    </div>
  )
}

export default App
