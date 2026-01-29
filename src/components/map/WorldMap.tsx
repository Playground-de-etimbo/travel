import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { useCountries } from '@/hooks/useCountries';
import { useCountryTooltip } from '@/hooks/useCountryTooltip';
import { useMapZoom } from '@/hooks/useMapZoom';
import { CountryTooltip } from './CountryTooltip';
import { getCountryFill, getCountryStroke, MAP_COLORS } from '@/lib/map/colors';
import { MAP_CONFIG } from '@/lib/map/config';
import { MAP_STYLE } from '@/lib/map/style';
import { createFallbackCountry } from '@/lib/map/fallbackCountry';
import { getGeoCountryCode } from '@/lib/map/geoCountryCode';
import { playCountrySound } from '@/lib/sound/countrySounds';
import type { Country } from '@/types';
import { useMemo, useRef, useState } from 'react';

// GeoJSON URL configured via src/lib/map/config.ts
// Override with: VITE_MAP_GEOJSON_URL=/data/countries-simple.geo.json pnpm dev
const geoUrl = MAP_CONFIG.geoJsonUrl;

interface WorldMapProps {
  beenTo: string[];
  onAddCountry: (code: string) => void;
  onRemoveCountry: (code: string) => void;
}

export function WorldMap({ beenTo, onAddCountry, onRemoveCountry }: WorldMapProps) {
  const { countries, loading: countriesLoading } = useCountries();
  const { tooltip, show, hide, update } = useCountryTooltip();
  const { position, handleMoveStart, handleMoveEnd, isDragging } = useMapZoom();
  const [hoveredGeo, setHoveredGeo] = useState<string | null>(null);
  const [addFlashCode, setAddFlashCode] = useState<string | null>(null);
  const [toasts, setToasts] = useState<
    Array<{ id: string; x: number; y: number; label: string; tone: 'add' | 'remove' }>
  >([]);
  const addFlashTimeoutRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Create a map of country codes to country objects for fast lookup
  const countryMap = useMemo(() => {
    const map = new Map<string, Country>();
    countries.forEach(country => {
      map.set(country.countryCode, country);
    });
    return map;
  }, [countries]);

  const normalizeCountryName = (name: string | undefined | null) => {
    if (!name) return '';
    return name
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const countryNameMap = useMemo(() => {
    const map = new Map<string, Country>();
    countries.forEach(country => {
      map.set(normalizeCountryName(country.countryName), country);
    });
    return map;
  }, [countries]);

  const resolveCountryFromGeo = (geoProperties: any): { code: string | null; country: Country | null } => {
    const isoCode = getGeoCountryCode(geoProperties);
    if (isoCode) {
      const country = countryMap.get(isoCode);
      return { code: isoCode, country: country ?? null };
    }

    const sovereignName =
      geoProperties?.admin ??
      geoProperties?.ADMIN ??
      geoProperties?.sovereignt ??
      geoProperties?.SOVEREIGNT;

    if (sovereignName) {
      const normalized = normalizeCountryName(sovereignName);
      const sovereignCountry = countryNameMap.get(normalized);
      if (sovereignCountry) {
        return { code: sovereignCountry.countryCode, country: sovereignCountry };
      }
    }

    return { code: null, country: null };
  };

  const handleMouseEnter = (geo: any, event: React.MouseEvent) => {
    const { country: resolvedCountry } = resolveCountryFromGeo(geo.properties);

    setHoveredGeo(geo.rsmKey);

    // Try to get full country data from countryMap
    let country = resolvedCountry;

    // If not found, create fallback from GeoJSON properties
    if (!country) {
      country = createFallbackCountry(geo.properties);
    }

    // Show tooltip if we have any country data (full or fallback)
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

  const enqueueToast = (label: string, tone: 'add' | 'remove', event?: React.MouseEvent) => {
    if (!event || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setToasts(prev => [...prev, { id, x, y, label, tone }]);
    window.setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 1500);
  };

  const triggerAddFeedback = (country: Country, event?: React.MouseEvent) => {
    if (addFlashTimeoutRef.current) {
      window.clearTimeout(addFlashTimeoutRef.current);
    }

    setAddFlashCode(country.countryCode);
    addFlashTimeoutRef.current = window.setTimeout(() => {
      setAddFlashCode(null);
    }, 2200);

    enqueueToast(`Added ${country.countryName}`, 'add', event);

    if (navigator.vibrate) {
      navigator.vibrate(25);
    }

    void playCountrySound('add');
  };

  const triggerRemoveFeedback = (country: Country, event?: React.MouseEvent) => {
    enqueueToast(`Removed ${country.countryName}`, 'remove', event);
    void playCountrySound('remove');
  };

  const handleClick = (geo: any, event?: React.MouseEvent) => {
    // Stop propagation to prevent ZoomableGroup from zooming
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    // Don't perform action if user was dragging the map
    if (isDragging) return;

    const { code: countryCode, country } = resolveCountryFromGeo(geo.properties);

    if (!country || !countryCode) return;

    const isVisited = beenTo.includes(countryCode);

    if (isVisited) {
      triggerRemoveFeedback(country, event);
      onRemoveCountry(countryCode);
    } else {
      // Instant add
      triggerAddFeedback(country, event);
      onAddCountry(countryCode);
    }

    hide(); // Hide tooltip
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
      ref={containerRef}
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
            scale: MAP_STYLE.PROJECTION.SCALE,
          }}
          className="w-full h-full"
        >
          <ZoomableGroup
            zoom={position.zoom}
            center={position.coordinates}
            onMoveStart={handleMoveStart}
            onMoveEnd={handleMoveEnd}
            minZoom={MAP_STYLE.ZOOM.MIN}
            maxZoom={MAP_STYLE.ZOOM.MAX}
            translateExtent={[MAP_STYLE.PROJECTION.TRANSLATE_EXTENT.MIN, MAP_STYLE.PROJECTION.TRANSLATE_EXTENT.MAX]}
          >
            {/* First pass: white coastline borders */}
            <Geographies geography={geoUrl}>
              {({ geographies }) => {
                return geographies.map((geo: any) => {
                  const { code } = resolveCountryFromGeo(geo.properties);
                  const safeCountryCode = code ?? '';
                  const fill = getCountryFill(safeCountryCode, beenTo);

                  return (
                    <Geography
                      key={`${geo.rsmKey}-white`}
                      geography={geo}
                      fill={fill}
                      stroke={MAP_COLORS.COASTLINE}
                      strokeWidth={MAP_STYLE.BORDER.COASTLINE}
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
                  const { code: countryCode } = resolveCountryFromGeo(geo.properties);
                  const safeCountryCode = countryCode ?? '';
                  const fill = getCountryFill(safeCountryCode, beenTo);
                  const stroke = getCountryStroke(safeCountryCode, beenTo);
                  const isHovered = geo.rsmKey === hoveredGeo;
                  const isVisited = countryCode ? beenTo.includes(countryCode) : false;
                  const isAddFlash = countryCode ? addFlashCode === countryCode : false;

                  // Use red hover color for visited countries (indicates removal)
                  const hoverFill = isVisited ? MAP_COLORS.HOVER_REMOVE : MAP_COLORS.HOVER;
                  const hoverStroke = isVisited ? MAP_COLORS.HOVER_REMOVE_BORDER : MAP_COLORS.HOVER_BORDER;
                  const displayFill = isAddFlash ? MAP_COLORS.ADD_FLASH : isHovered ? hoverFill : fill;
                  const displayStroke = isAddFlash ? MAP_COLORS.ADD_FLASH_BORDER : isHovered ? hoverStroke : stroke;
                  const displayStrokeWidth = isAddFlash
                    ? MAP_STYLE.BORDER.HOVER
                    : isHovered
                      ? MAP_STYLE.BORDER.HOVER
                      : MAP_STYLE.BORDER.DEFAULT;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={displayFill}
                      stroke={displayStroke}
                      strokeWidth={displayStrokeWidth}
                      className={isAddFlash ? 'map-add-pulse' : undefined}
                      onMouseEnter={(event) => handleMouseEnter(geo, event)}
                      onMouseLeave={handleMouseLeave}
                      onClick={(event) => handleClick(geo, event)}
                      data-country-code={countryCode ?? undefined}
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

            {/* Third pass: visited country borders on top */}
            <Geographies geography={geoUrl}>
              {({ geographies }) => {
                return geographies.map((geo: any) => {
                  const { code: countryCode } = resolveCountryFromGeo(geo.properties);
                  const isVisited = countryCode ? beenTo.includes(countryCode) : false;
                  const isHovered = geo.rsmKey === hoveredGeo;

                  // Only render visited countries (unless hovered)
                  if (!isVisited || isHovered) return null;

                  return (
                    <Geography
                      key={`${geo.rsmKey}-visited-border`}
                      geography={geo}
                      fill="none"
                      stroke={MAP_COLORS.BEEN_TO_BORDER}
                      strokeWidth={MAP_STYLE.BORDER.DEFAULT}
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
          </ZoomableGroup>
        </ComposableMap>
      </div>

      {toasts.map(toast => (
      <div
          key={toast.id}
          className={`map-toast map-toast--${toast.tone}`}
          style={{ left: toast.x, top: toast.y }}
        >
          {toast.label}
        </div>
      ))}

      <CountryTooltip
        country={tooltip.country}
        position={tooltip.position}
        visible={tooltip.visible}
        isVisited={tooltip.country ? beenTo.includes(tooltip.country.countryCode) : false}
      />
    </div>
  );
}
