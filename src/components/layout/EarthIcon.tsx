import { useId } from 'react';

export const EarthIcon = ({ size = 32, className = '' }: { size?: number; className?: string }) => {
  // Generate unique IDs for this instance to avoid Chrome SVG rendering bugs
  const uniqueId = useId();
  const circleClipId = `circleClip-${uniqueId}`;
  const spaceGradId = `spaceGrad-${uniqueId}`;
  const earthGradId = `earthGrad-${uniqueId}`;
  const sunGradId = `sunGrad-${uniqueId}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Destino logo"
    >
      <title>Destino</title>

      <defs>
        {/* Circular clip path to keep everything inside */}
        <clipPath id={circleClipId}>
          <circle cx="50" cy="50" r="48" />
        </clipPath>

        {/* Space background gradient */}
        <radialGradient id={spaceGradId} cx="50%" cy="50%">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#0f172a" />
        </radialGradient>

        {/* Earth gradient */}
        <radialGradient id={earthGradId}>
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#0284c7" />
        </radialGradient>

        {/* Sun gradient */}
        <radialGradient id={sunGradId}>
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#fbbf24" />
        </radialGradient>
      </defs>

      {/* Everything clipped inside the circle */}
      <g clipPath={`url(#${circleClipId})`}>
        {/* Space background */}
        <circle cx="50" cy="50" r="48" fill={`url(#${spaceGradId})`} />

        {/* Stars in space */}
        <g fill="#ffffff" opacity="0.8">
          <circle cx="75" cy="20" r="1" />
          <circle cx="85" cy="35" r="0.8" />
          <circle cx="90" cy="50" r="1.2" />
          <circle cx="80" cy="70" r="0.9" />
          <circle cx="70" cy="85" r="1" />
          <circle cx="85" cy="60" r="0.7" />
        </g>

        {/* Earth - huge, cropped bottom-left, rotates on axis */}
        <g className="earth-rotate" style={{ transformOrigin: '28px 66px' }}>
          <circle cx="28" cy="66" r="42" fill={`url(#${earthGradId})`} />

          {/* Real country landmasses - dispersed and larger */}
          <g fill="#10b981" opacity="0.75">
            {/* Philippines - scaled 2x, moved to top */}
            <path d="M 21.6 24.1 L 23.2 24.2 L 23.1 25.3 L 23.2 27.9 L 21.8 29.9 L 23.1 31.4 L 26.1 32.2 L 26.5 33.6 L 25.0 33.5 L 23.8 33.2 L 21.1 32.5 L 20.3 31.4 L 20.4 30.5 L 19.3 30.2 L 19.0 27.8 L 20.0 25.7 Z" />
            <path d="M 30.5 41.6 L 30.8 43.8 L 29.5 43.6 L 29.2 45.9 L 26.6 45.7 L 26.6 43.5 L 24.9 43.4 L 22.7 44.4 L 23.1 42.3 L 25.3 41.1 L 27.3 41.5 L 28.9 40.6 L 30.2 40.1 Z" />
            <path d="M 28.9 35.0 L 29.4 37.0 L 28.0 36.5 L 28.1 37.1 L 28.5 38.2 L 27.6 38.6 L 27.6 37.3 L 27.0 37.3 L 26.7 36.2 L 27.8 36.3 L 27.8 35.7 L 26.7 34.3 L 28.4 34.4 Z" />

            {/* Indonesia - scaled 2x, moved to left */}
            <path d="M -12.3 39.3 L -10.3 42.4 L -7.4 39.4 L -4.8 39.6 L -2.1 40.1 L -1.7 50.2 L -4.6 49.0 L -6.8 49.8 L -5.3 47.9 L -6.6 45.0 L -10.7 44.2 L -13.3 43.9 L -12.8 41.4 L -12.5 38.8 Z" />
            <path d="M 0.1 39.3 L -0.1 41.4 L -0.6 44.7 L -2.3 47.9 L -3.3 50.2 L -5.5 50.4 L -7.2 50.3 L -9.3 50.6 L -11.4 50.9 L -12.5 48.9 L -13.5 46.8 L -12.6 44.2 L -11.2 46.0 L -9.4 45.1 L -7.8 43.8 L -5.2 43.5 L -3.7 40.9 L -1.2 38.8 L -0.2 39.7 Z" />
            <path d="M 43.9 42.0 L 46.2 45.5 L 49.4 42.0 L 52.2 42.5 L 55.1 43.6 L 55.0 55.5 L 52.1 53.7 L 49.7 54.1 L 51.3 51.5 L 50.1 47.5 L 45.7 46.1 L 42.9 45.5 L 42.1 45.0 L 40.6 43.8 L 43.5 43.2 L 41.0 42.7 L 38.8 41.8 L 40.5 40.5 L 43.8 40.7 Z" />

            {/* Papua New Guinea - scaled 2.5x, moved to right */}
            <path d="M 56.8 54.7 L 59.6 58.3 L 60.6 59.2 L 61.6 60.1 L 63.3 61.5 L 61.6 61.0 L 58.1 59.9 L 55.6 57.6 L 52.2 54.7 L 49.7 55.8 L 48.3 57.9 L 45.5 57.3 L 45.5 43.6 L 51.8 46.6 L 54.1 48.7 L 57.8 51.3 L 56.3 52.3 Z" />
            <path d="M 66.0 51.0 L 64.6 51.1 L 64.3 51.6 L 63.3 52.1 L 62.3 52.3 L 61.3 52.1 L 59.6 51.3 L 58.6 50.8 L 58.9 50.3 L 60.6 50.6 L 61.6 50.5 L 61.8 49.8 L 62.1 49.8 L 62.3 50.8 L 63.3 50.7 L 64.1 49.6 L 65.1 48.6 L 64.9 47.6 L 66.6 47.6 L 67.0 48.2 L 67.0 49.6 Z" />
            <path d="M 68.3 49.6 L 67.8 50.1 L 67.6 48.7 L 67.1 47.5 L 66.0 46.3 L 64.6 44.3 L 62.8 42.6 L 63.4 42.3 L 64.9 42.8 L 66.0 43.3 L 67.0 44.0 L 68.1 45.8 L 68.9 47.1 Z" />

            {/* Australia */}
            <path d="M 26.1 61.7 L 21.3 62.4 L 18.5 63.5 L 17.8 64.1 L 16.7 64.1 L 15.7 64.0 L 14.2 64.2 L 13.7 64.6 L 12.7 65.1 L 12.4 65.2 L 11.3 65.1 L 10.5 64.9 L 9.6 63.7 L 10.2 62.8 L 10.1 61.5 L 9.5 59.6 L 8.1 56.8 L 8.0 56.3 L 8.2 56.7 L 8.0 55.9 L 8.4 56.2 L 8.7 56.1 L 8.2 55.1 L 8.2 53.7 L 8.3 52.5 L 8.7 52.7 L 9.2 52.1 L 10.8 51.0 L 11.6 50.8 L 12.5 50.7 L 13.5 50.2 L 14.6 50.1 L 16.4 48.6 L 16.7 47.7 L 17.1 46.9 L 17.5 46.6 L 17.9 47.3 L 18.2 47.3 L 18.4 47.1 L 18.0 46.7 L 18.2 46.5 L 18.3 46.4 L 18.6 46.4 L 18.9 46.5 L 19.2 46.0 L 18.9 45.7 L 19.2 45.5 L 19.6 45.6 L 19.5 45.4 L 19.5 45.3 L 19.7 45.2 L 19.9 45.2 L 19.8 45.0 L 19.9 44.7 L 20.1 44.7 L 20.2 44.7 L 20.5 44.8 L 20.6 44.4 L 20.6 44.1 L 20.8 44.4 L 21.0 44.1 L 21.3 44.2 L 21.4 44.0 L 21.7 44.1 L 22.3 44.5 L 22.8 44.9 L 22.6 45.4 L 23.0 45.2 L 23.6 45.1 L 24.1 45.3 L 24.5 44.9 L 24.0 44.6 L 24.2 44.0 L 24.8 43.5 L 25.0 42.8 L 25.1 42.8 L 25.5 42.7 L 25.6 42.3 L 26.4 42.4 L 27.1 42.3 L 26.8 41.6 L 26.4 41.5 L 26.6 41.4 L 26.7 41.3 L 27.1 41.5 L 27.6 41.7 L 28.1 42.0 L 28.6 42.0 L 29.2 42.1 L 29.8 42.4 L 30.1 42.2 L 30.4 42.1 L 30.5 42.4 L 30.8 42.6 L 31.0 42.1 L 31.4 42.6 L 31.1 43.0 L 31.1 43.2 L 30.8 43.3 L 30.4 43.5 L 30.6 43.8 L 29.9 44.9 L 31.0 45.9 L 31.9 46.3 L 33.3 47.0 L 35.1 47.7 L 35.8 46.6 L 36.1 45.0 L 36.1 43.3 L 36.4 42.8 L 36.2 42.4 L 36.6 41.5 L 37.1 41.0 L 37.4 41.6 L 37.6 42.5 L 38.0 43.2 L 38.5 44.7 L 39.1 44.5 L 39.8 45.2 L 39.9 46.0 L 40.2 46.9 L 40.4 47.1 L 40.5 48.3 L 41.1 49.3 L 41.9 49.5 L 42.8 50.1 L 43.1 50.3 L 43.4 50.7 L 43.2 50.9 L 43.6 51.1 L 43.9 51.6 L 44.1 52.4 L 44.5 52.3 L 45.1 52.5 L 45.3 52.7 L 45.4 53.6 L 45.9 54.1 L 46.2 54.2 L 47.1 55.3 L 47.4 55.8 L 47.6 56.5 L 47.7 57.5 L 48.0 58.3 L 47.8 59.7 L 47.5 61.0 L 47.0 62.2 L 46.6 62.8 L 46.1 63.4 L 45.7 63.6 L 45.7 64.1 L 45.3 64.6 L 45.2 65.1 L 44.9 65.6 L 44.6 66.4 L 44.4 67.2 L 44.0 67.8 L 40.9 68.8 L 41.0 69.0 L 40.4 68.9 L 40.0 68.3 L 39.3 68.5 L 39.0 68.2 L 38.6 68.5 L 37.7 68.8 L 36.1 68.4 L 35.1 68.1 L 34.3 67.2 L 33.7 65.8 L 33.8 65.6 L 33.3 65.6 L 32.9 65.5 L 32.8 64.6 L 32.3 65.2 L 31.5 65.2 L 32.0 64.5 L 32.4 63.7 L 32.4 62.9 L 32.3 63.0 L 31.5 63.8 L 30.8 64.3 L 30.4 64.9 L 30.2 65.1 L 29.8 64.7 L 29.8 64.2 L 29.1 63.3 L 28.7 63.1 L 28.6 62.6 L 28.3 62.3 L 27.9 62.3 L 26.9 62.1 Z" />

            {/* New Zealand - scaled 2x, moved to bottom */}
            <path d="M 40.1 88.7 L 40.6 89.5 L 40.5 91.1 L 41.8 92.3 L 43.0 92.3 L 41.4 94.3 L 40.2 94.3 L 39.8 95.1 L 38.2 96.7 L 37.2 96.5 L 38.0 95.1 L 37.2 93.3 L 38.4 92.5 L 39.4 90.5 L 39.6 89.1 L 39.2 86.8 L 39.6 85.5 L 40.4 87.0 Z" />
            <path d="M 35.6 92.1 L 35.6 92.7 L 36.4 92.5 L 36.4 93.1 L 36.2 93.7 L 35.6 94.3 L 34.4 95.1 L 33.6 95.5 L 33.6 96.3 L 33.0 96.1 L 32.0 96.5 L 31.2 97.3 L 30.0 98.5 L 29.0 98.9 L 28.4 99.3 L 27.6 98.9 L 27.2 98.3 L 26.2 97.9 L 26.2 97.5 L 27.2 96.5 L 28.9 95.3 L 29.8 95.3 L 30.6 94.9 L 31.8 94.5 L 32.8 93.9 L 33.6 92.9 L 34.2 92.7 L 34.6 91.9 L 35.6 91.5 Z" />
          </g>

          {/* Equator line */}
          <ellipse
            cx="28"
            cy="66"
            rx="42"
            ry="13"
            fill="none"
            stroke="#ffffff"
            strokeWidth="0.7"
            opacity="0.25"
          />
        </g>

        {/* Sun - orbits from NW to SE along earth's visible horizon */}
        {/* Using transform to position at earth center (28, 66), then rotate */}
        <g className="sun-orbit" transform="translate(28, 66)">
          {/* Sun positioned 49 units from origin at -120° angle (NW) */}
          <g transform="translate(-24.5, -42.4)">
            <circle cx="0" cy="0" r="7" fill={`url(#${sunGradId})`} />
            <g stroke="#fbbf24" strokeWidth="1.4" strokeLinecap="round" opacity="0.8">
              <line x1="0" y1="-9.5" x2="0" y2="-7" />
              <line x1="9.5" y1="0" x2="7" y2="0" />
              <line x1="0" y1="9.5" x2="0" y2="7" />
              <line x1="-9.5" y1="0" x2="-7" y2="0" />
              <line x1="6.7" y1="-6.7" x2="4.9" y2="-4.9" />
              <line x1="6.7" y1="6.7" x2="4.9" y2="4.9" />
              <line x1="-6.7" y1="6.7" x2="-4.9" y2="4.9" />
              <line x1="-6.7" y1="-6.7" x2="-4.9" y2="-4.9" />
            </g>
          </g>
        </g>
      </g>

      {/* Border circle - outside the clip */}
      <circle
        cx="50"
        cy="50"
        r="48"
        fill="none"
        stroke="#14b8a6"
        strokeWidth="4"
      />
    </svg>
  );
};
