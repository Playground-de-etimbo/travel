import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { WorldMap } from '@/components/map/WorldMap';
import { SearchPanel } from '@/components/search/SearchPanel';
import { useCountries } from '@/hooks/useCountries';
import { useUserData } from '@/hooks/useUserData';
import { setSoundMuted } from '@/lib/sound/countrySounds';

function App() {
  const { countries } = useCountries();
  const { beenTo, addCountry, removeCountry, clearAll } = useUserData();
  const [soundMuted, setSoundMutedState] = useState(false);

  const handleToggleSound = () => {
    setSoundMutedState((prev) => {
      const next = !prev;
      setSoundMuted(next);
      return next;
    });
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Header
          soundMuted={soundMuted}
          onToggleSound={handleToggleSound}
          onClearSession={clearAll}
        />
        <Routes>
          <Route path="/" element={
            <main>
              {/* Map Hero Section - Full viewport interactive map */}
              <section id="map-hero" className="relative">
                <WorldMap
                  beenTo={beenTo}
                  onAddCountry={addCountry}
                  onRemoveCountry={removeCountry}
                />
              </section>

              {/* Search Panel - Sticky panel overlapping map */}
              <SearchPanel
                beenTo={beenTo}
                countries={countries}
                onAddCountry={addCountry}
                onRemoveCountry={removeCountry}
              />

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
              <section id="been-to" className="py-16 border-t border-border bg-muted/30">
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
              <section id="stats" className="py-16 border-t border-border bg-muted/30">
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
