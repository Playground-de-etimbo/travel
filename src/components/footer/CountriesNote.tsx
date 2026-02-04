export function CountriesNote() {
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-1.5 tracking-tight">
          A Note on Countries
        </h3>
        <p className="text-sm text-muted-foreground/80">
          What this map includes and why
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-sm max-w-none">
        <p className="text-sm text-foreground/90 leading-relaxed mb-3">
          Building this has been a quiet lesson in how surprisingly complex the idea of a "country" really is.
          For this app, we count countries using the widely recognised travel definition based on UN member
          states, along with a few commonly accepted additions like Vatican City and Palestine.
        </p>
        <p className="text-sm text-foreground/90 leading-relaxed mb-3">
          The map itself goes further. We include territories and dependencies like French Guiana, Greenland,
          and Curaçao—real places people visit, even if they're not sovereign nations in the political sense.
          You'll also notice a small number of places outside formal standards, included because people expect
          them to be here.
        </p>
        <p className="text-sm text-foreground/90 leading-relaxed mb-3">
          In short: countries are counted using a familiar global definition, the map includes a richer set
          of places people actually travel to, and the goal is clarity, not gatekeeping.
        </p>
        <p className="text-sm text-foreground/90 leading-relaxed">
          One final apology: Singapore is currently too small to render cleanly on the map at this zoom level,
          so it may not appear as expected. This is a technical limitation, not a value judgement. We absolutely
          still love you, and yes, everyone should visit. 🇸🇬
        </p>
      </div>
    </div>
  );
}
