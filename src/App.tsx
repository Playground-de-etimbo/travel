import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Toaster } from '@/components/ui/sonner';
import { WorldMap } from '@/components/map/WorldMap';
import { SearchPanel } from '@/components/search/SearchPanel';
import { MobileSearchPanel } from '@/components/search/MobileSearchPanel';
import { RecommendationsSection } from '@/components/recommendations/RecommendationsSection';
import { TechStackSection } from '@/components/footer/TechStackSection';
import { CountriesNote } from '@/components/footer/CountriesNote';
import { PortfolioFooter } from '@/components/footer/PortfolioFooter';
import { useCountries } from '@/hooks/useCountries';
import { useUserData } from '@/hooks/useUserData';
import { setSoundMuted } from '@/lib/sound/countrySounds';

function App() {
  const { countries } = useCountries();
  const { beenTo, addCountry, removeCountry, clearAll } = useUserData();
  const [soundMuted, setSoundMutedState] = useState(false);
  const [panTarget, setPanTarget] = useState<string | null>(null);

  const handleToggleSound = () => {
    setSoundMutedState((prev) => {
      const next = !prev;
      setSoundMuted(next);
      return next;
    });
  };

  const handleAddCountryFromSearch = (code: string) => {
    addCountry(code);
    setPanTarget(code); // Trigger pan animation
    setTimeout(() => setPanTarget(null), 100); // Clear after WorldMap processes
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Header
          soundMuted={soundMuted}
          onToggleSound={handleToggleSound}
          onClearSession={clearAll}
        />
        <Toaster />
        <Routes>
          <Route path="/" element={
            <main>
              {/* Map Hero Section - Full viewport interactive map */}
              <section id="map-hero" className="relative">
                <WorldMap
                  beenTo={beenTo}
                  onAddCountry={addCountry}
                  onRemoveCountry={removeCountry}
                  panToCountryCode={panTarget}
                />
              </section>

              {/* Search Panel - Desktop sticky panel overlapping map */}
              <SearchPanel
                beenTo={beenTo}
                countries={countries}
                onAddCountry={handleAddCountryFromSearch}
                onRemoveCountry={removeCountry}
              />

              {/* Mobile Search Panel - Fixed bottom panel with scroll expansion */}
              <MobileSearchPanel
                beenTo={beenTo}
                countries={countries}
                onAddCountry={handleAddCountryFromSearch}
                onRemoveCountry={removeCountry}
              />

              {/* Recommendations Section */}
              <RecommendationsSection
                countries={countries}
                beenTo={beenTo}
                addCountry={addCountry}
              />

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
                    <h2 className="text-3xl font-bold mb-2">Country Directory</h2>
                    <p className="text-muted-foreground">
                      Browse and search all countries
                    </p>
                  </div>
                  <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                      Country cards and search coming soon
                    </CardContent>
                  </Card>
                </div>
              </section>

              {/* Been To Section */}
              <section id="been-to" className="py-16 border-t border-border">
                <div className="container mx-auto px-4">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2">Been To</h2>
                    <p className="text-muted-foreground">
                      Countries you've visited
                    </p>
                  </div>
                  <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                      Your travel history will appear here
                    </CardContent>
                  </Card>
                </div>
              </section>

              {/* Want To Go Section */}
              <section id="want-to-go" className="py-16 border-t border-border">
                <div className="container mx-auto px-4">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-2">Want To Go</h2>
                    <p className="text-muted-foreground">
                      Your travel wishlist
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
                    <h2 className="text-3xl font-bold mb-2">Your Travel Stats</h2>
                    <p className="text-muted-foreground">
                      Compare your travel to global averages
                    </p>
                  </div>
                  <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                      Statistics and comparisons coming soon
                    </CardContent>
                  </Card>
                </div>
              </section>
            </main>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
