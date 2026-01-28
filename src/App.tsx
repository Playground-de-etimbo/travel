import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { WorldMap } from '@/components/map/WorldMap';
import { AddCountryModal } from '@/components/country/AddCountryModal';
import { useCountries } from '@/hooks/useCountries';
import { useUserData } from '@/hooks/useUserData';

function App() {
  const { countries } = useCountries();
  const { beenTo, addCountry } = useUserData();
  const [modalOpen, setModalOpen] = useState(false);
  const [preSelectedCountry, setPreSelectedCountry] = useState<string | undefined>();

  const handleCountrySelect = (code: string) => {
    setPreSelectedCountry(code);
    setModalOpen(true);
  };

  const handleAddClick = () => {
    setPreSelectedCountry(undefined);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setPreSelectedCountry(undefined);
  };

  const handleAddCountry = async (code: string) => {
    await addCountry(code);
    // Keep modal open for rapid-fire additions
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Header />
        <Routes>
          <Route path="/" element={
            <main>
              {/* Map Hero Section - Full viewport interactive map */}
              <section id="map-hero" className="relative">
                <WorldMap
                  beenTo={beenTo}
                  onCountrySelect={handleCountrySelect}
                  onAddClick={handleAddClick}
                />
              </section>

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

              {/* Add Country Modal */}
              <AddCountryModal
                open={modalOpen}
                onClose={handleModalClose}
                countries={countries}
                beenTo={beenTo}
                onAddCountry={handleAddCountry}
                preSelectedCountry={preSelectedCountry}
              />
            </main>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
