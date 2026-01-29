export const Header = () => {
  return (
    <header className="absolute top-6 left-0 right-0 z-10 px-8 flex items-start justify-between">
      <div className="flex flex-col items-center flex-1">
        <h1 className="text-5xl font-bold text-gray-800 mb-1" style={{ fontFamily: 'Nunito, sans-serif' }}>
          Country Crush
        </h1>
        <p className="text-base text-gray-600" style={{ fontFamily: 'Nunito, sans-serif' }}>
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
