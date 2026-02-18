# Architecture

Detailed technical architecture for Destino. For a quick overview, see [CLAUDE.md](CLAUDE.md).

---

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| **Runtime** | React 18 + TypeScript | Strict mode enabled |
| **Build** | Vite 6 | HTTPS dev server via mkcert |
| **Styling** | Tailwind CSS v4 | CSS-based config in `src/index.css` |
| **UI Components** | shadcn/ui (Radix primitives) | Auto-generated in `src/components/ui/` |
| **Map** | react-simple-maps 3 + d3-geo | ZoomableGroup with custom click handling |
| **Search** | Fuse.js | Fuzzy matching with weighted fields |
| **Images** | Unsplash API | Optional; graceful flag emoji fallback |
| **Postcard** | html-to-image | DOM-to-PNG generation |
| **Storage** | localStorage | Via StorageAdapter abstraction |
| **Hosting** | Vercel | Analytics + Speed Insights integrated |
| **Unit Tests** | Vitest + React Testing Library | jsdom environment |
| **E2E Tests** | Playwright | Chromium browser testing |

### Notable Dependencies
- `class-variance-authority` - Component variant system (used by shadcn)
- `clsx` + `tailwind-merge` - Conditional class composition
- `next-themes` - Light/dark mode management
- `sonner` - Toast notifications
- `lucide-react` - Icon library
- `fuse.js` - Fuzzy search for country autocomplete
- `html-to-image` - Postcard PNG generation

---

## Application Structure

### Entry Point

```
index.html → src/main.tsx → App.tsx
```

`main.tsx` renders `<App />` inside `<StrictMode>` with Vercel `<Analytics />` and `<SpeedInsights />`.

### App.tsx — The Single Page

All sections are rendered in `App.tsx`. There is no router. The component:

1. Calls `useCountries()`, `useUserData()`, `useSharedPostcard()`
2. Creates memoized/stable callbacks for country add/remove
3. Handles shared postcard interception (shows modal instead of modifying data)
4. Renders all sections with appropriate props

**Lazy-loaded components** (below the fold):
- `WorldMap` — the map library is heavy (~200KB)
- `RecommendationsSection` — algorithm + Unsplash
- `PostcardSection` — html-to-image

**Code splitting** in `vite.config.ts`:
```typescript
manualChunks: {
  'react-vendor': ['react', 'react-dom'],
  'map': ['react-simple-maps', 'd3-geo'],
  'ui': ['@radix-ui/*', 'lucide-react'],
}
```

---

## Directory Structure

```
src/
├── App.tsx                    # Root: renders all sections, manages top-level state
├── App.css                    # Minimal app-level styles
├── index.css                  # Tailwind v4 config, CSS variables, animations
├── main.tsx                   # React entry + Vercel analytics
├── vite-env.d.ts
│
├── components/
│   ├── country/
│   │   └── SearchableCountryList.tsx
│   │
│   ├── footer/
│   │   ├── CountriesNote.tsx          # Data attribution note
│   │   ├── PortfolioFooter.tsx        # Personal branding footer
│   │   └── TechStackSection.tsx       # Built-with section
│   │
│   ├── layout/
│   │   ├── EarthIcon.tsx              # SVG logo component
│   │   ├── FloatingPillNav.tsx        # Floating anchor navigation
│   │   └── Header.tsx                 # Top header with sound toggle + clear
│   │
│   ├── map/
│   │   ├── WorldMap.tsx               # Interactive map (lazy-loaded)
│   │   ├── CountryTooltip.tsx         # Hover tooltip with add/remove hint
│   │   └── __tests__/
│   │
│   ├── postcard/
│   │   ├── PostcardSection.tsx        # Main section (lazy-loaded)
│   │   ├── PostcardFront.tsx          # Front face with map + stats
│   │   ├── PostcardBack.tsx           # Back face with stamps
│   │   ├── PostageStamp.tsx           # Individual country stamp
│   │   ├── FlagRibbon.tsx             # Decorative flag ribbon
│   │   ├── PostcardMiniMap.tsx        # Small map for postcard
│   │   ├── PostcardLoadingOverlay.tsx # Loading state during generation
│   │   ├── SharedPostcardBanner.tsx   # Banner when viewing shared postcard
│   │   ├── StartOwnJourneyModal.tsx   # Modal for shared→own transition
│   │   └── __tests__/
│   │
│   ├── recommendations/
│   │   ├── RecommendationsSection.tsx # Main section (lazy-loaded)
│   │   ├── PreferencesForm.tsx        # Home location, interests, flight duration
│   │   ├── HomeLocationInput.tsx      # Country autocomplete for home
│   │   ├── InterestsSelector.tsx      # Weather/Relaxation/Culture/Action cards
│   │   ├── FlightDurationSelector.tsx # Flight time range selector
│   │   ├── BudgetSlider.tsx           # Budget/Modest/Bougie tier cards
│   │   ├── RecommendationsGrid.tsx    # Grid of recommendation cards
│   │   ├── RecommendationCard.tsx     # Individual country recommendation
│   │   ├── LoadingState.tsx           # Loading skeleton
│   │   ├── SampleResults.tsx          # Pre-generation sample display
│   │   └── __tests__/
│   │
│   ├── search/
│   │   ├── SearchBox.tsx              # Desktop search input
│   │   ├── SearchPanel.tsx            # Desktop sticky sidebar
│   │   ├── MobileSearchBox.tsx        # Mobile search input
│   │   ├── MobileSearchPanel.tsx      # Mobile bottom sheet
│   │   ├── MobileSearchOverlay.tsx    # Full-screen mobile search
│   │   ├── AutocompleteDropdown.tsx   # Search results dropdown
│   │   ├── AutocompleteResultGroup.tsx# Grouped results by region
│   │   ├── CountryChip.tsx            # Selected country chip
│   │   ├── RegionCountryGroup.tsx     # Region grouping in list
│   │   ├── TravelStatsBar.tsx         # Stats display in search panel
│   │   └── VisitedCountriesList.tsx   # List of visited countries
│   │
│   └── ui/                            # shadcn/ui (DO NOT EDIT)
│       ├── accordion.tsx
│       ├── alert-dialog.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       ├── input.tsx
│       └── sonner.tsx
│
├── data/
│   └── countryCoordinates.ts          # Lat/lng for distance calculations
│
├── hooks/
│   ├── useAutocomplete.ts             # Fuse.js search with debounce
│   ├── useCountries.ts                # Fetches /data/countries.json
│   ├── useCountryAliases.ts           # Fetches /data/country-aliases.json
│   ├── useCountryEnrichment.ts        # REST Countries API enrichment
│   ├── useCountryTooltip.ts           # Map hover tooltip state
│   ├── useGeolocation.ts              # IP-based country detection
│   ├── useMapZoom.ts                  # Map pan/zoom with drag detection
│   ├── usePostcardStats.ts            # Postcard statistics calculation
│   ├── useRecommendations.ts          # Recommendation generation + persistence
│   ├── useScrollExpansion.ts          # Mobile search panel scroll behavior
│   ├── useSearchFilter.ts             # Country filtering logic
│   ├── useSharedPostcard.ts           # URL param shared postcard reading
│   ├── useTravelStats.ts             # Travel statistics
│   └── useUserData.ts                 # Core state: beenTo[], wantToGo[], persistence
│
├── lib/
│   ├── api/
│   │   ├── geolocation.ts             # IP geolocation (ipapi.co)
│   │   ├── restCountries.ts           # REST Countries API for enrichment
│   │   └── unsplash.ts                # Unsplash photo fetching with rate limiting
│   │
│   ├── map/
│   │   ├── colors.ts                  # Theme-aware map colors (CSS variables)
│   │   ├── config.ts                  # Map projection and zoom config
│   │   ├── fallbackCountry.ts         # Fallback for unknown country codes
│   │   ├── flagEmoji.ts               # Country code → flag emoji
│   │   ├── geoCountryCode.ts          # GeoJSON feature → country code mapping
│   │   ├── geojson.ts                 # GeoJSON loading and processing
│   │   └── style.ts                   # Map element styling
│   │
│   ├── postcard/
│   │   └── shareUrl.ts                # Encode/decode postcard data in URL
│   │
│   ├── recommendations/
│   │   ├── algorithm.ts               # Main scoring: interest + distance + cost
│   │   ├── costCalculator.ts          # 7-day trip cost by budget tier
│   │   ├── distanceCalculator.ts      # Great-circle distance
│   │   ├── reasonGenerator.ts         # Personalized recommendation text
│   │   └── verbGenerator.ts           # Playful action verbs
│   │
│   ├── sound/
│   │   └── countrySounds.ts           # Audio feedback for add/remove
│   │
│   ├── storage/
│   │   ├── interface.ts               # StorageAdapter interface
│   │   ├── localStorage.ts            # LocalStorageAdapter implementation
│   │   └── index.ts                   # Exports singleton adapter
│   │
│   └── utils.ts                       # cn() utility (clsx + tailwind-merge)
│
├── test/
│   └── setup.ts                       # Vitest setup (imports jest-dom matchers)
│
└── types/
    ├── index.ts                       # Re-exports all types
    ├── country.ts                     # Country, CountryState, TravelInterest
    ├── user.ts                        # UserData, UserPreferences
    └── recommendation.ts              # RecommendationPreferences, Result, etc.
```

---

## Data Architecture

### Static Data Files (`public/data/`)

| File | Size | Description |
|------|------|-------------|
| `countries.json` | ~150KB | 195+ countries with metadata, descriptions, costs, interests |
| `country-aliases.json` | ~30KB | Alternative names for search ("UK" → "GB", "Holland" → "NL") |
| `country-travel-costs.json` | ~60KB | Budget/modest/bougie cost tiers per country |
| `countries-natural-earth-110m.geo.json` | ~500KB | Simplified GeoJSON boundaries |

**Country metadata** is loaded once on mount via `useCountries()` and passed as props throughout the app.

**Travel costs** are synthetic AI-generated estimates — not suitable for real trip budgeting.

### Runtime Data

| Source | API | Usage |
|--------|-----|-------|
| IP Geolocation | ipapi.co | Auto-detect home country |
| REST Countries | restcountries.com | Country enrichment (capital, language, demonym) |
| Unsplash | api.unsplash.com | Recommendation card photos |

All external APIs are optional and have graceful fallbacks.

### User Data (localStorage)

Stored under a single key as JSON. Schema:

```typescript
{
  beenTo: string[],                    // Country codes
  wantToGo: string[],                  // Country codes
  lastUpdated: Date,
  version: "1.0",
  recommendations?: RecommendationResult,  // Cached results
  preferences?: {
    theme: 'light' | 'dark' | 'system',
    displayCurrency: string,
    recommendations?: {
      detectedCountry: string | null,
      budgetTier: 'budget' | 'modest' | 'bougie',
      detectionDismissed: boolean,
    }
  }
}
```

---

## Key Patterns

### Performance Optimizations

1. **Lazy loading** — WorldMap, Recommendations, Postcard loaded on demand
2. **Manual chunks** — react, map, and UI libraries split into separate bundles
3. **React.memo** — Used on components that receive stable props
4. **useCallback/useMemo** — All App.tsx callbacks are stable; starfield positions computed once
5. **Ref-based callbacks** — `useUserData` uses refs to keep callbacks stable without state deps
6. **Async image enrichment** — Recommendations render immediately; photos load in background
7. **Font fallback** — System fonts used first; custom fonts load async

### Shared Postcard Flow

1. User generates postcard → `PostcardSection` renders front/back with `html-to-image`
2. Share URL encodes `beenTo[]` + name in URL search params (`src/lib/postcard/shareUrl.ts`)
3. Recipient opens URL → `useSharedPostcard()` decodes params
4. `App.tsx` shows `SharedPostcardBanner` and uses `effectiveBeenTo` (shared data, not local)
5. If recipient tries to interact → `StartOwnJourneyModal` prompts them to start their own journey

### Recommendation Algorithm

1. User sets home country, interests (weather/relaxation/culture/action), flight duration
2. `algorithm.ts` scores all countries not in beenTo:
   - Interest match (weighted by selected interests)
   - Distance penalty (based on flight duration preference)
   - Cost factor
3. Top 6 results returned with personalized reasons
4. Costs calculated for budget/modest/bougie tiers
5. Unsplash images fetched asynchronously and merged in

---

## Configuration Files

| File | Purpose |
|------|---------|
| `vite.config.ts` | Build config, HTTPS, code splitting, Vitest config, path alias |
| `tsconfig.json` | Root TS config (references app + node) |
| `tsconfig.app.json` | App TS config — strict, ES2020, `@/` alias |
| `tsconfig.node.json` | Node TS config for Vite/scripts |
| `postcss.config.js` | PostCSS with `@tailwindcss/postcss` |
| `components.json` | shadcn/ui config (style, base color, aliases) |
| `playwright.config.ts` | E2E test config |
| `.prettierrc` | Code formatting |
| `.editorconfig` | Editor settings |
| `.env.example` | Template for environment variables |

---

## Scripts (`scripts/`)

| Script | Purpose |
|--------|---------|
| `ensure-dev-https.mjs` | Generates mkcert HTTPS certs for local dev |
| `generate_country_descriptions.mjs` | Fetches Wikipedia summaries → country descriptions |
| `generate_country_aliases.mjs` | Fetches REST Countries API → search aliases |
| `editorial_pass_descriptions.mjs` | Editorial cleanup of generated descriptions |
| `update-worldbank-regions.mjs` | Updates World Bank region classifications |

Scripts cache API responses in `scripts/.cache/` to avoid repeated calls.

---

Last updated: 2026-02-18
