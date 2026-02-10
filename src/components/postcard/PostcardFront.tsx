import type { Ref } from 'react';
import { PostcardMiniMap } from './PostcardMiniMap';
import { FlagRibbon } from './FlagRibbon';

interface PostcardFrontProps {
  cardRef: Ref<HTMLDivElement>;
  visitedCount: number;
  percentExplored: number;
  regionCount: number;
  totalRegions: number;
  flagEmojis: string[];
  beenTo: string[];
  languageCount: number;
  currencyCount: number;
}

export const PostcardFront = ({
  cardRef,
  visitedCount,
  percentExplored,
  regionCount,
  totalRegions,
  flagEmojis,
  beenTo,
  languageCount,
  currencyCount,
}: PostcardFrontProps) => {
  return (
    <div
      ref={cardRef}
      className="relative max-w-[340px] w-full mx-auto overflow-hidden flex flex-col"
      style={{
        aspectRatio: '9 / 16',
        background: '#f5f0e8',
        borderRadius: '4px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      }}
    >
      {/* Content wrapper */}
      <div className="flex flex-col h-full px-5 py-5 gap-2.5">
        {/* Header */}
        <div className="text-center">
          <h3
            className="text-[11px] uppercase tracking-[0.3em] text-[#1a2744]"
            style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 800 }}
          >
            Destino Postcard
          </h3>
          {/* Guilloche divider */}
          <div
            className="h-[2px] mt-1.5 mx-auto w-3/4 rounded-full"
            style={{
              background:
                'linear-gradient(90deg, transparent, #1a2744 20%, #c4b89a 50%, #1a2744 80%, transparent)',
            }}
          />
        </div>

        {/* Hero count */}
        <div className="text-center flex-shrink-0">
          <div
            className="text-[64px] leading-none text-[#1a2744]"
            style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600 }}
          >
            {visitedCount}
          </div>
          <div
            className="text-[10px] uppercase tracking-[0.2em] text-[#5c4a32]/70 mt-0.5"
            style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 600 }}
          >
            Countries Visited
          </div>
        </div>

        {/* Mini map */}
        <div className="flex-shrink-0">
          <PostcardMiniMap beenTo={beenTo} />
        </div>

        {/* Flag ribbon */}
        <div className="flex-shrink-0">
          <FlagRibbon flags={flagEmojis} />
        </div>

        {/* Stats grid - 2x2 */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 flex-shrink-0 px-1">
          {/* Regions */}
          <div className="flex justify-between items-baseline">
            <span
              className="text-[9px] uppercase tracking-wider text-[#5c4a32]/60"
              style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 600 }}
            >
              Regions Visited
            </span>
            <span
              className="text-[12px] text-[#1a2744]"
              style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 500 }}
            >
              {regionCount}/{totalRegions}
            </span>
          </div>

          {/* World Explored */}
          <div className="flex justify-between items-baseline">
            <span
              className="text-[9px] uppercase tracking-wider text-[#5c4a32]/60"
              style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 600 }}
            >
              World Explored
            </span>
            <span
              className="text-[12px] text-[#1a2744]"
              style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 500 }}
            >
              {percentExplored.toFixed(1)}%
            </span>
          </div>

          {/* Languages */}
          <div className="flex justify-between items-baseline">
            <span
              className="text-[9px] uppercase tracking-wider text-[#5c4a32]/60"
              style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 600 }}
            >
              Languages Heard
            </span>
            <span
              className="text-[12px] text-[#1a2744]"
              style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 500 }}
            >
              {languageCount}
            </span>
          </div>

          {/* Currencies */}
          <div className="flex justify-between items-baseline">
            <span
              className="text-[9px] uppercase tracking-wider text-[#5c4a32]/60"
              style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 600 }}
            >
              Currencies Used
            </span>
            <span
              className="text-[12px] text-[#1a2744]"
              style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 500 }}
            >
              {currencyCount}
            </span>
          </div>
        </div>

        {/* Spacer to push footer to bottom */}
        <div className="flex-grow" />

        {/* Postcard footer */}
        <div className="flex-shrink-0 text-center border-t border-dashed border-[#c4b89a] pt-2">
          <p
            className="text-[16px] text-[#5c4a32]/80"
            style={{ fontFamily: 'Caveat, cursive', fontWeight: 600 }}
          >
            Wish you were here!
          </p>
          <p
            className="text-[7px] uppercase tracking-[0.2em] text-[#5c4a32]/40 mt-0.5"
            style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 600 }}
          >
            {window.location.hostname}
          </p>
        </div>
      </div>
    </div>
  );
};
