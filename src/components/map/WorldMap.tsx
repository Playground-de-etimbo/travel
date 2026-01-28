import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { useCountries } from '@/hooks/useCountries';
import { useCountryTooltip } from '@/hooks/useCountryTooltip';
import { useMapZoom } from '@/hooks/useMapZoom';
import { CountryTooltip } from './CountryTooltip';
import { SelectedCountriesBar } from './SelectedCountriesBar';
import { getCountryFill, getCountryStroke, MAP_COLORS } from '@/lib/map/colors';
import { MAP_CONFIG } from '@/lib/map/config';
import type { Country } from '@/types';
import { useMemo, useState } from 'react';

// GeoJSON URL configured via src/lib/map/config.ts
// Override with: VITE_MAP_GEOJSON_URL=/data/countries-simple.geo.json pnpm dev
const geoUrl = MAP_CONFIG.geoJsonUrl;

interface WorldMapProps {
  beenTo: string[];
  onCountrySelect: (code: string) => void;
  onAddClick: () => void;
}

export function WorldMap({ beenTo, onCountrySelect, onAddClick }: WorldMapProps) {
  const { countries, loading: countriesLoading } = useCountries();
  const { tooltip, show, hide, update } = useCountryTooltip();
  const { position, handleMoveStart, handleMoveEnd, isDragging } = useMapZoom();
  const [hoveredGeo, setHoveredGeo] = useState<string | null>(null);

  // Create a map of country codes to country objects for fast lookup
  const countryMap = useMemo(() => {
    const map = new Map<string, Country>();
    countries.forEach(country => {
      map.set(country.countryCode, country);
    });
    return map;
  }, [countries]);

  // Get selected countries for the bar
  const selectedCountries = useMemo(() => {
    return beenTo
      .map(code => countryMap.get(code))
      .filter((c): c is Country => c !== undefined);
  }, [beenTo, countryMap]);

  const handleMouseEnter = (geo: any, event: React.MouseEvent) => {
    const countryCode = geo.properties.ISO_A2;
    const country = countryMap.get(countryCode);

    setHoveredGeo(geo.rsmKey);

    if (country) {
      show(country, event.clientX, event.clientY);
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (tooltip.visible) {
      update(event.clientX, event.clientY);
    }
  };

  const handleMouseLeave = () => {
    setHoveredGeo(null);
    hide();
  };

  const handleClick = (geo: any, event?: React.MouseEvent) => {
    // Don't open modal if user was dragging the map
    if (isDragging) return;

    const countryCode = geo.properties.ISO_A2;
    const country = countryMap.get(countryCode);

    if (country) {
      // On touch devices, show tooltip first, then open modal on second tap
      if (event && 'ontouchstart' in window) {
        if (tooltip.visible && tooltip.country?.countryCode === countryCode) {
          // Second tap - open modal
          onCountrySelect(countryCode);
          hide();
        } else {
          // First tap - show tooltip
          show(country, event.clientX, event.clientY);
        }
      } else {
        // Desktop - directly open modal
        onCountrySelect(countryCode);
      }
    }
  };

  if (countriesLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-b from-card to-background">
        <div className="text-center">
          <div className="text-lg text-muted-foreground">Loading map...</div>
        </div>
      </div>
    );
  }

  if (countries.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-b from-card to-background">
        <div className="text-center">
          <div className="text-lg text-muted-foreground">Unable to load map data</div>
          <div className="text-sm text-muted-foreground mt-2">Please refresh the page</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative h-screen overflow-hidden"
      style={{
        background: `url('/patterns/ocean-waves.jpg')`,
        backgroundSize: '300px 300px',
        backgroundRepeat: 'repeat',
      }}
    >
      {/* Lightening overlay */}
      <div className="absolute inset-0 bg-white opacity-90 pointer-events-none" />

      <div
        className="w-full h-full relative"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <ComposableMap
          projection="geoEquirectangular"
          projectionConfig={{
            scale: 200,
          }}
          className="w-full h-full"
        >
          <ZoomableGroup
            zoom={position.zoom}
            center={position.coordinates}
            onMoveStart={handleMoveStart}
            onMoveEnd={handleMoveEnd}
            minZoom={1}
            maxZoom={4}
            translateExtent={[[-300, -200], [900, 600]]}
          >
            {/* First pass: white coastline borders */}
            <Geographies geography={geoUrl}>
              {({ geographies }) => {
                return geographies.map((geo: any) => {
                  const countryCode = geo.properties.ISO_A2;
                  const fill = getCountryFill(countryCode, beenTo);

                  return (
                    <Geography
                      key={`${geo.rsmKey}-white`}
                      geography={geo}
                      fill={fill}
                      stroke="#FFFFFF"
                      strokeWidth={4.0}
                      style={{
                        default: { outline: 'none', pointerEvents: 'none' },
                        hover: { outline: 'none', pointerEvents: 'none' },
                        pressed: { outline: 'none', pointerEvents: 'none' },
                      }}
                    />
                  );
                });
              }}
            </Geographies>

            {/* Second pass: grey country borders and interaction */}
            <Geographies geography={geoUrl}>
              {({ geographies }) => {
                // Sort geographies so hovered one renders last (on top)
                const sortedGeos = [...geographies].sort((a, b) => {
                  if (a.rsmKey === hoveredGeo) return 1;
                  if (b.rsmKey === hoveredGeo) return -1;
                  return 0;
                });

                return sortedGeos.map((geo: any) => {
                  const countryCode = geo.properties.ISO_A2;
                  const fill = getCountryFill(countryCode, beenTo);
                  const isHovered = geo.rsmKey === hoveredGeo;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={isHovered ? MAP_COLORS.HOVER : fill}
                      stroke={MAP_COLORS.HOVER_BORDER}
                      strokeWidth={isHovered ? 1.0 : 0.6}
                      onMouseEnter={(event) => handleMouseEnter(geo, event)}
                      onMouseLeave={handleMouseLeave}
                      onClick={(event) => handleClick(geo, event)}
                      style={{
                        default: {
                          outline: 'none',
                          cursor: 'pointer',
                        },
                        hover: {
                          outline: 'none',
                          cursor: 'pointer',
                        },
                        pressed: {
                          outline: 'none',
                        },
                      }}
                    />
                  );
                });
              }}
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>

      <CountryTooltip
        country={tooltip.country}
        position={tooltip.position}
        visible={tooltip.visible}
      />

      <SelectedCountriesBar
        countries={selectedCountries}
        onAddClick={onAddClick}
      />
    </div>
  );
}
