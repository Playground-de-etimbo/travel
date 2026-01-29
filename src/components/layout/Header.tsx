export const Header = () => {
  return (
    <header className="absolute top-6 left-0 right-0 z-10 px-8 flex items-start justify-between">
      <div className="flex flex-col items-center flex-1">
        <svg
          className="w-full max-w-[520px] h-16 text-gray-800 -mb-1"
          viewBox="0 0 520 80"
          role="img"
          aria-label="Country Crush"
        >
          <title>Country Crush</title>
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="currentColor"
            stroke="#ffffff"
            strokeWidth="10"
            paintOrder="stroke fill"
            strokeLinejoin="round"
            style={{ fontFamily: 'Nunito, sans-serif', fontSize: 56, fontWeight: 800, letterSpacing: 2 }}
          >
            COUNTRY CRUSH
          </text>
        </svg>
        <p
          className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-700 mt-0"
          style={{ fontFamily: 'Nunito, sans-serif' }}
        >
          Where have you been to? Where will you go?
        </p>
      </div>
      <a
        href="#"
        className="text-xs text-gray-600 hover:text-gray-900 transition-colors inline-flex items-center gap-1.5 whitespace-nowrap mt-2 absolute right-8"
      >
        ☕ <span>Buy me a coffee</span>
      </a>
    </header>
  );
};
