import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { MAP_CONFIG } from '@/lib/map/config';
import { MAP_COLORS } from '@/lib/map/colors';
import { getGeoCountryCode } from '@/lib/map/geoCountryCode';

interface PostcardMiniMapProps {
  beenTo: string[];
}

export const PostcardMiniMap = ({ beenTo }: PostcardMiniMapProps) => {
  const beenToSet = new Set(beenTo);

  return (
    <div className="aspect-[2/1] overflow-hidden rounded">
      <ComposableMap
        projection="geoEquirectangular"
        projectionConfig={{
          scale: 62,
          rotate: [0, 0, 0],
        }}
        width={400}
        height={200}
        style={{ width: '100%', height: '100%' }}
      >
        <Geographies geography={MAP_CONFIG.geoJsonUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const code = getGeoCountryCode(geo.properties);
              const isVisited = code ? beenToSet.has(code) : false;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={isVisited ? MAP_COLORS.BEEN_TO : '#eae8e3'}
                  stroke="#d8d4cc"
                  strokeWidth={0.3}
                  style={{
                    default: { outline: 'none', pointerEvents: 'none' },
                    hover: { outline: 'none', pointerEvents: 'none' },
                    pressed: { outline: 'none', pointerEvents: 'none' },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};
