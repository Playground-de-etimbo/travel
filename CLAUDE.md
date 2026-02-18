# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Destino** - A travel motivation web app for tracking countries you've visited, getting personalized destination recommendations, and sharing your journey via postcards.

**Status:** v1.0 complete. Deployed on Vercel. Single-page layout with interactive map, search, recommendations, and postcard sharing all working.

## Essential Commands

```bash
pnpm dev              # Start HTTPS dev server (https://localhost:5173)
pnpm build            # Production build (tsc + vite)
pnpm lint             # Run ESLint
pnpm preview          # Preview production build

pnpm test             # Unit tests in watch mode (Vitest)
pnpm test:run         # Unit tests single pass
pnpm test:ui          # Vitest UI
pnpm test:e2e         # Playwright E2E tests
```

**Note:** `pnpm dev` requires mkcert for local HTTPS. The `predev` script auto-generates certs on first run.

## Architecture Overview

### Single-Page Layout

The app is a single scrollable page — no React Router, no route changes. `App.tsx` renders all sections directly:

- `#map-hero` - Full-viewport interactive world map (lazy-loaded)
- Search panels (desktop: sticky sidebar, mobile: bottom sheet with scroll expansion)
- Recommendations section (lazy-loaded) - personalized travel suggestions
- `#passport` - Postcard section (lazy-loaded) - shareable travel postcard
- `#about` - Tech stack + countries note
- Portfolio footer
- `#directory`, `#want-to-go`, `#stats` - Placeholder sections (v2)

Navigation uses `FloatingPillNav` with smooth scrolling to anchor IDs.

### Key Data Flow

```
App.tsx
├── useCountries()     → fetches /data/countries.json on mount
├── useUserData()      → loads/saves beenTo[] via StorageAdapter
├── useSharedPostcard() → reads shared postcard from URL params
│
├── WorldMap           → click-to-toggle countries on map
├── SearchPanel        → autocomplete search to add/remove countries
├── MobileSearchPanel  → mobile-optimized search
├── RecommendationsSection → useRecommendations() → algorithm + Unsplash
└── PostcardSection    → generates shareable postcard images
```

### Storage Abstraction Layer

The app uses a `StorageAdapter` interface (`src/lib/storage/interface.ts`) with a `LocalStorageAdapter` implementation. Always use the exported singleton:

```typescript
// ✅ Correct - use the singleton
import { storage } from '@/lib/storage';
await storage.save(userData);
await storage.update({ recommendations: result });

// ❌ Never use raw localStorage
localStorage.setItem('userData', JSON.stringify(userData));
```

**Note:** `useUserData` currently creates its own `LocalStorageAdapter` instance rather than using the singleton. This is a known inconsistency — new code should use the `storage` export.

### State Management

- **No Context API, no Redux** — state lives in hooks called from `App.tsx` and passed as props
- `useUserData` manages `beenTo[]` and `wantToGo[]` with ref-based stable callbacks
- `useRecommendations` manages preferences, generation, and Unsplash image enrichment
- `useSharedPostcard` reads encoded postcard data from URL search params
- All callbacks in App.tsx are wrapped in `useCallback` to prevent unnecessary re-renders

### Path Alias

`@/` maps to `src/` (configured in `vite.config.ts` and `tsconfig.app.json`):

```typescript
import type { Country } from '@/types';
import { storage } from '@/lib/storage';
```

## Type System

### Country (`src/types/country.ts`)
```typescript
interface Country {
  countryCode: string;        // ISO 3166-1 alpha-2
  countryName: string;
  continent: string;
  region: string;             // World Bank region
  currencyCode: string;       // ISO 4217
  currencyName: string;
  flagEmoji: string;
  description: string;        // Two-sentence travel summary
  baselineCost: number;       // Synthetic USD estimate
  nightlyCost: number;
  interests: TravelInterest[]; // 'weather' | 'relaxation' | 'culture' | 'action'
}
```

### UserData (`src/types/user.ts`)
```typescript
interface UserData {
  beenTo: string[];
  wantToGo: string[];
  lastUpdated: Date;
  version: string;
  recommendations?: RecommendationResult;
  preferences?: UserPreferences;  // theme, displayCurrency, detected country, budget tier
}
```

### Recommendation types (`src/types/recommendation.ts`)
- `RecommendationPreferences` - home location, interests, flight duration
- `CountryRecommendation` - country code, reason, image, costs by tier, match score
- `RecommendationResult` - array of recommendations + metadata

## Component Architecture

```
src/components/
├── country/          # SearchableCountryList
├── footer/           # PortfolioFooter, TechStackSection, CountriesNote
├── layout/           # Header (with sound toggle), FloatingPillNav, EarthIcon logo
├── map/              # WorldMap (lazy), CountryTooltip
├── postcard/         # PostcardSection (lazy), Front/Back, stamps, SharedPostcardBanner
├── recommendations/  # RecommendationsSection (lazy), PreferencesForm, cards, grid
├── search/           # SearchBox, SearchPanel, MobileSearchPanel, autocomplete
└── ui/               # shadcn/ui (auto-generated — DO NOT edit directly)
```

### Lazy Loading

Three heavy components are lazy-loaded via `React.lazy()` in `App.tsx`:
- `WorldMap` — react-simple-maps + d3-geo
- `RecommendationsSection` — form + algorithm + Unsplash
- `PostcardSection` — html-to-image generation

Manual chunks in `vite.config.ts` split: `react-vendor`, `map`, `ui`.

## Map Implementation

Uses `react-simple-maps` with `ZoomableGroup` and `d3-geo` projections.

### Click-to-Toggle Pattern

**Problem:** `ZoomableGroup` captures clicks via a transparent rect overlay before they reach `<Geography>` elements.

**Solution:** Global capture-phase click listener in `WorldMap.tsx`:
```typescript
document.addEventListener('click', handleGlobalClick, true);  // capture phase
```
Each `<Geography>` gets a `data-country-code` attribute. The handler checks `event.target.tagName === 'path'` and reads the attribute.

**Drag detection:** `useMapZoom` only flags `isDragging=true` if the map position actually changed, preventing clicks from being misidentified as drags.

### Map Colors

Theme-aware via CSS variables in `src/lib/map/colors.ts`. Colors adapt to light/dark mode automatically. Key states: unvisited, been-to (teal), hover, hover-remove, add-flash, spotlight.

## Recommendations Engine

Located in `src/lib/recommendations/`:
- `algorithm.ts` - Scores countries by interest match, distance, and cost
- `costCalculator.ts` - Computes budget/modest/bougie breakdowns for 7-day trips
- `distanceCalculator.ts` - Great-circle distance from home country
- `reasonGenerator.ts` - Creates personalized recommendation text
- `verbGenerator.ts` - Playful action verbs ("Explore", "Wander", "Frolic")

Images are enriched asynchronously from Unsplash after initial results render. Falls back to flag emojis on gradient backgrounds if no API key.

## Styling

### Tailwind v4
- CSS-based configuration in `src/index.css` (no `tailwind.config.js`)
- `@tailwindcss/postcss` handles processing
- Theme colors defined as CSS custom properties

### Conventions
- Mobile-first: base styles for mobile, `sm:` / `md:` / `lg:` for larger
- Group classes logically: layout, spacing, colors, effects
- Use CSS variables via `var(--color-*)` for theme colors
- For highly custom buttons, prefer native `<button>` over shadcn `<Button>` to avoid cva conflicts
- Never edit `src/components/ui/` directly — create wrapper components instead

### Midnight Map Theme
Map colors in `src/lib/map/colors.ts` use CSS variables that adapt to light/dark mode:
- Ocean: dark blue-gray
- Visited: teal
- Unvisited: subtle gray
- Celestial animations: sun/moon with CSS in `src/index.css`

## Testing

### Unit Tests (Vitest + React Testing Library)
- Config: `test` block in `vite.config.ts`
- Setup: `src/test/setup.ts`
- Convention: `__tests__/` directories co-located with source
- Run: `pnpm test` (watch) or `pnpm test:run` (CI)

### E2E Tests (Playwright)
- Config: `playwright.config.ts`
- Run: `pnpm test:e2e`

See [WORKFLOWS.md](WORKFLOWS.md) for the TDD workflow.

## Common Pitfalls

1. **Don't mutate state arrays:**
   ```typescript
   // ❌ Wrong
   beenTo.push('US'); setBeenTo(beenTo);
   // ✅ Correct
   setBeenTo([...beenTo, 'US']);
   ```

2. **Don't bypass the storage adapter:**
   Use `storage` from `@/lib/storage`, never raw localStorage calls.

3. **Don't edit shadcn/ui components directly:**
   They're auto-generated. Create wrapper components for customization.

4. **Don't add routes to App.tsx:**
   The app is single-page — use anchor links and sections.

5. **Environment variables must start with `VITE_`:**
   ```bash
   VITE_UNSPLASH_ACCESS_KEY=your-key-here
   ```
   Access: `import.meta.env.VITE_UNSPLASH_ACCESS_KEY`

6. **HTTPS required for dev:**
   Geolocation API requires HTTPS. `pnpm dev` handles this via mkcert certs in `.cert/`.

## Git Workflow

```
<type>: <description>

Types: feat, fix, docs, style, refactor, perf, test, chore
```

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/App.tsx` | Root component — all sections rendered here |
| `src/hooks/useUserData.ts` | beenTo/wantToGo state + localStorage persistence |
| `src/hooks/useRecommendations.ts` | Recommendation generation + Unsplash enrichment |
| `src/components/map/WorldMap.tsx` | Interactive map with click-to-toggle |
| `src/lib/storage/interface.ts` | StorageAdapter contract |
| `src/lib/recommendations/algorithm.ts` | Scoring algorithm |
| `src/lib/map/colors.ts` | Theme-aware map color palette |
| `src/index.css` | Global styles, Tailwind v4 config, CSS variables, animations |
| `public/data/countries.json` | All country metadata (195+ entries) |
| `public/data/country-travel-costs.json` | Budget/modest/bougie cost tiers |

Last updated: 2026-02-18
