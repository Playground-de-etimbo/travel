import { useMemo } from 'react';
import type { Ref } from 'react';
import { PostageStamp } from './PostageStamp';
import type { Country } from '@/types/country';

interface PostcardBackProps {
  cardRef: Ref<HTMLDivElement>;
  visitedCount: number;
  visitedCountries: Country[];
  userName: string;
}

// Deterministic pseudo-random from a string seed
function seededRandom(seed: string): () => number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return () => {
    h = (h ^ (h >>> 16)) * 0x45d9f3b;
    h = (h ^ (h >>> 16)) * 0x45d9f3b;
    h = h ^ (h >>> 16);
    return (h >>> 0) / 0xffffffff;
  };
}

function generateStampPositions(
  countries: Country[],
): { top: string; left: string; rotation: number; zIndex: number; opacity: number }[] {
  if (countries.length === 0) return [];

  const seed = countries
    .map((c) => c.countryCode)
    .sort()
    .join('');
  const rand = seededRandom(seed);
  const n = countries.length;

  // Stamp visual footprint as % of stamp zone (includes rotation headroom)
  // Stamp is 80×90px in a ~340×374px zone → ~24%×24%, padded for rotation
  const FOOTPRINT_W = 26;
  const FOOTPRINT_H = 27;

  // Safe placement bounds for stamp top-left corner (% of zone)
  const MIN_X = -2; // left edge: -2 + 24 = 22%
  const MAX_X = 85; // right edge: 85 + 24 = 109%
  const MIN_Y = -2; // top edge: 0 + 24 = 24%
  const MAX_Y = 80; // bottom edge: 80 + 25 = 105%, safe from text

  const placed: { x: number; y: number }[] = [];
  const results: {
    top: string;
    left: string;
    rotation: number;
    zIndex: number;
    opacity: number;
  }[] = [];

  // Mitchell's best-candidate: for each stamp, try K random positions and
  // pick the one with the greatest minimum distance to all placed stamps.
  // This disperses stamps naturally — no two will overlap when space allows.
  const K = 30;

  for (let i = 0; i < n; i++) {
    let bestX = 0;
    let bestY = 0;
    let bestMinDist = -1;

    for (let k = 0; k < K; k++) {
      const cx = MIN_X + rand() * (MAX_X - MIN_X);
      const cy = MIN_Y + rand() * (MAX_Y - MIN_Y);

      if (placed.length === 0) {
        bestX = cx;
        bestY = cy;
        break;
      }

      // Minimum squared distance to any placed stamp, normalized by footprint
      let minDist = Infinity;
      for (const p of placed) {
        const dx = (cx - p.x) / FOOTPRINT_W;
        const dy = (cy - p.y) / FOOTPRINT_H;
        const dist = dx * dx + dy * dy;
        if (dist < minDist) minDist = dist;
      }

      if (minDist > bestMinDist) {
        bestMinDist = minDist;
        bestX = cx;
        bestY = cy;
      }
    }

    placed.push({ x: bestX, y: bestY });

    const rotation = (rand() - 0.5) * 28; // -14 to +14 degrees
    const opacity = 0.78 + rand() * 0.14; // 0.78–0.92 for layered depth

    results.push({
      top: `${bestY}%`,
      left: `${bestX}%`,
      rotation,
      zIndex: Math.floor(rand() * n) + 1,
      opacity,
    });
  }

  return results;
}

function getLetterBody(visitedCount: number): string {
  if (visitedCount === 1) {
    return "The journey hasn't started yet, but the bags are packed and the heart is ready. Every great adventure begins with a single step — and mine is coming soon.";
  }
  if (visitedCount === 2) {
    return "I've taken my first step beyond the familiar. Two countries down, a whole world still waiting. This is just the beginning of something beautiful.";
  }
  return `I've wandered through ${visitedCount} countries, collected sunsets in foreign skies, and left pieces of my heart on distant shores. The map keeps growing, and so do I.`;
}

export const PostcardBack = ({
  cardRef,
  visitedCount,
  visitedCountries,
  userName,
}: PostcardBackProps) => {
  const stampPositions = useMemo(
    () => generateStampPositions(visitedCountries),
    [visitedCountries],
  );
  const letterBody = getLetterBody(visitedCount);

  return (
    <div
      ref={cardRef}
      className="postcard-paper relative max-w-[340px] w-full mx-auto overflow-hidden"
      style={{
        aspectRatio: '9 / 16',
        borderRadius: '4px',
        boxShadow:
          'inset 0 0 0 3px #1a2744, inset 0 0 0 6px #ffffff, inset 0 0 0 7.5px #1a2744, 0 4px 20px rgba(0,0,0,0.06)',
      }}
    >
      {/* Stamps scattered across the top, filling space above the text */}
      <div className="absolute inset-x-0 top-0 bottom-[38%] z-0">
        {visitedCountries.map((country, i) => {
          const pos = stampPositions[i];
          if (!pos) return null;
          return (
            <div
              key={country.countryCode}
              className="absolute"
              style={{
                top: pos.top,
                left: pos.left,
                zIndex: pos.zIndex,
                opacity: pos.opacity,
              }}
            >
              <PostageStamp
                flagEmoji={country.flagEmoji}
                countryName={country.countryName}
                countryCode={country.countryCode}
                rotation={pos.rotation}
              />
            </div>
          );
        })}
      </div>

      {/* Letter content — anchored to bottom */}
      <div className="relative z-10 flex flex-col h-full px-6 pb-6 justify-end">
        {/* Letter text with ruled lines */}
        <div
          style={{
            backgroundImage:
              'repeating-linear-gradient(to bottom, transparent 0px, transparent 25px, rgba(196,184,154,0.3) 25px, rgba(196,184,154,0.3) 26px)',
            backgroundPosition: '0 0',
            paddingTop: '2px',
          }}
        >
          <p
            className="text-[17px] text-[#3a3028]"
            style={{
              fontFamily: 'Caveat, cursive',
              fontWeight: 500,
              lineHeight: '26px',
            }}
          >
            Dear World,
          </p>
          <p
            className="text-[17px] text-[#3a3028]"
            style={{
              fontFamily: 'Caveat, cursive',
              fontWeight: 500,
              lineHeight: '26px',
            }}
          >
            {letterBody}
          </p>

          {/* Sign-off */}
          <p
            className="text-[16px] text-[#3a3028]"
            style={{
              fontFamily: 'Caveat, cursive',
              fontWeight: 600,
              lineHeight: '26px',
            }}
          >
            xo, {userName}
          </p>
        </div>

        {/* Address block */}
        <div className="pt-4">
          <div className="border-t-2 border-[#1a2744]/20 pt-2">
            <p
              className="text-[9px] uppercase tracking-wider text-[#1a2744]/50"
              style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700 }}
            >
              To: My Future Self
            </p>
            <p
              className="text-[8px] uppercase tracking-wider text-[#1a2744]/35 mt-0.5"
              style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 600 }}
            >
              Re: The places that changed me
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
