interface PostageStampProps {
  flagEmoji: string;
  countryName: string;
  countryCode: string;
  rotation: number;
}

export const PostageStamp = ({
  flagEmoji,
  countryName,
  countryCode,
  rotation,
}: PostageStampProps) => {
  const w = 80;
  const h = 90;
  const r = 2.2;
  const spacing = 7;
  const inset = 5;
  const maskId = `perf-${countryCode}`;

  // Pre-compute perforation dots
  const dots: { cx: number; cy: number }[] = [];
  for (let x = inset + spacing / 2; x < w - inset; x += spacing) {
    dots.push({ cx: x, cy: inset });
    dots.push({ cx: x, cy: h - inset });
  }
  for (let y = inset + spacing / 2; y < h - inset; y += spacing) {
    dots.push({ cx: inset, cy: y });
    dots.push({ cx: w - inset, cy: y });
  }

  return (
    <div
      className="shrink-0 relative"
      style={{
        width: w,
        height: h,
        transform: `rotate(${rotation}deg)`,
      }}
    >
      {/* SVG stamp shape with perforated edges */}
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        className="absolute inset-0"
        style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.1))' }}
      >
        <defs>
          <mask id={maskId}>
            <rect width={w} height={h} fill="white" />
            {dots.map((d, i) => (
              <circle key={i} cx={d.cx} cy={d.cy} r={r} fill="black" />
            ))}
          </mask>
        </defs>
        {/* Stamp body */}
        <rect
          width={w}
          height={h}
          fill="#faf9f6"
          mask={`url(#${maskId})`}
        />
        {/* Inner border */}
        <rect
          x={inset + 2}
          y={inset + 2}
          width={w - (inset + 2) * 2}
          height={h - (inset + 2) * 2}
          fill="none"
          stroke="#c4b89a"
          strokeWidth={0.75}
        />
      </svg>

      {/* Content positioned over the SVG */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ pointerEvents: 'none' }}
      >
        <span className="text-[22px] leading-none">{flagEmoji}</span>
        <span
          className="text-[6px] uppercase tracking-wider text-[#1a2744] text-center leading-tight mt-1 px-2"
          style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 700 }}
        >
          {countryName}
        </span>
        <span
          className="text-[6.5px] uppercase tracking-[0.15em] text-[#5c4a32]/50 mt-0.5"
          style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 600 }}
        >
          {countryCode}
        </span>
      </div>
    </div>
  );
};
