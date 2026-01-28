# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Travel Motivation Planner - A web app for tracking countries you've visited and want to visit, with comparative travel statistics.

**Current Status:** MVP in development - Phase 1 foundation complete, transitioning to single-page layout.

**Key Design Decision:** Converting from multi-page routes to a single scrollable page with anchor link navigation. All sections (Map, Directory, Been To, Want To Go, Stats) live on one page.

## Essential Commands

```bash
# Development
pnpm dev              # Start dev server at http://localhost:5173
pnpm build            # Build for production (runs tsc + vite build)
pnpm lint             # Run ESLint
pnpm preview          # Preview production build locally

# Docker alternative (see DOCKER.md)
docker-compose up     # Start dev server in container
```

## Architecture Overview

### Single-Page Layout

The app uses a single-page design with React Router only for the root route. All content sections are rendered on the home page:

- `#map-hero` - Full-viewport interactive world map
- `#directory` - Country browsing and search
- `#been-to` - Countries you've visited
- `#want-to-go` - Travel wishlist
- `#stats` - Comparative travel statistics

Navigation uses smooth scrolling to anchor links, not route changes.

### Storage Abstraction Layer

**Critical Pattern:** The app uses a storage adapter pattern (`src/lib/storage/`) to abstract localStorage and Firestore:

- `interface.ts` - `StorageAdapter` interface defining the contract
- `localStorage.ts` - Current MVP implementation
- `index.ts` - Exports the active adapter
- Future: `firestore.ts` for post-MVP Firebase sync

**Why this matters:** Always interact with storage through the exported `storage` adapter, never directly with localStorage or Firestore. This enables seamless migration from localStorage (MVP) to Firestore (v1.1+) without changing component code.

```typescript
// ✅ Correct
import { storage } from '@/lib/storage';
await storage.save(userData);

// ❌ Avoid
localStorage.setItem('userData', JSON.stringify(userData));
```

### State Management

**User Data Flow:**
1. `useUserData` hook manages `beenTo` and `wantToGo` arrays
2. Data loads from storage on mount
3. State updates trigger automatic saves via the storage adapter
4. Components consume state from the hook (no Context API yet)

**Pattern:** The hook provides `addCountry`, `removeCountry`, and `clearAll` methods that handle both state updates and persistence atomically.

### Path Alias

The codebase uses `@/` as an alias for `src/` (configured in `vite.config.ts`):

```typescript
import { Country } from '@/types';
import { storage } from '@/lib/storage';
import { Button } from '@/components/ui/button';
```

Always use `@/` for imports within the src directory.

## Component Architecture

### Directory Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui components (auto-generated, don't edit)
│   ├── layout/       # Header, navigation (persistent elements)
│   ├── map/          # WorldMap, map-related components
│   ├── country/      # Country cards, search, modals
│   └── stats/        # Statistics displays
├── hooks/            # Custom React hooks (useCountries, useUserData, etc.)
├── lib/
│   ├── storage/      # Storage abstraction (localStorage → Firestore)
│   └── map/          # Map utilities (GeoJSON, styling, colors)
└── types/            # TypeScript interfaces (Country, UserData, etc.)
```

### Type System

**Country Interface** (`src/types/country.ts`):
- `countryCode` - ISO 3166-1 alpha-2 (e.g., "US")
- `countryName` - Full name
- `region` - Continent/region
- `currencyCode` - ISO 4217
- `flagEmoji` - Unicode flag emoji
- `baselineCost` / `nightlyCost` - Placeholder travel costs

**UserData Interface** (`src/types/user.ts`):
- `beenTo: string[]` - Array of country codes
- `wantToGo: string[]` - Array of country codes
- `lastUpdated: Date`
- `version: string`

### shadcn/ui Components

The project uses shadcn/ui for UI components. These live in `src/components/ui/` and are auto-generated:

```bash
# Add a new component
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
```

**Important:** Don't manually edit files in `src/components/ui/`. If customization is needed, create a wrapper component.

## Map Implementation

The project uses `react-simple-maps` for the interactive world map:

- GeoJSON data: `public/data/countries.geo.json` (Natural Earth 10m resolution)
- Country metadata: `public/data/countries.json`
- Map colors: Defined in `src/lib/map/colors.ts` using "Midnight Map" theme
- Click-to-toggle: Countries are clickable to mark as visited

## Key Patterns and Conventions

### File Naming

- **Components:** PascalCase - `CountryCard.tsx`
- **Hooks:** camelCase with `use` prefix - `useCountries.ts`
- **Utils:** camelCase - `formatCurrency.ts`
- **Types:** PascalCase - `country.ts` (exports `Country` interface)

### Component Structure

```typescript
// 1. Imports
import { useState } from 'react';
import type { Country } from '@/types';

// 2. Props interface
interface CountryCardProps {
  country: Country;
  onToggle: (code: string) => void;
}

// 3. Component with named export
export const CountryCard = ({ country, onToggle }: CountryCardProps) => {
  // Hooks first
  const [isHovered, setIsHovered] = useState(false);

  // Event handlers
  const handleClick = () => onToggle(country.countryCode);

  // Render
  return <div>{/* JSX */}</div>;
};
```

### Styling

Mobile-first Tailwind CSS:

```typescript
// Responsive breakpoints: sm:640px, md:768px, lg:1024px, xl:1280px
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
```

Group classes logically (layout, spacing, colors, effects):

```typescript
<div className="
  flex items-center gap-2
  px-4 py-2
  bg-white hover:bg-gray-50
  border border-gray-200 rounded-lg
  transition-colors
">
```

### TypeScript Guidelines

- Use explicit types for props and return values
- Prefer `type` imports: `import type { Country } from '@/types'`
- Avoid `any` - use `unknown` if type is truly unknown
- Interfaces for objects, types for unions/primitives

## Firebase Migration Plan (Post-MVP)

The codebase is architected for a seamless localStorage → Firestore migration:

1. **MVP (current):** `LocalStorageAdapter` handles all persistence
2. **v1.1+:** Add `FirestoreAdapter` implementing the same `StorageAdapter` interface
3. **Migration:** Update `src/lib/storage/index.ts` to export Firestore adapter based on auth state
4. **No component changes required** - the abstraction layer handles everything

See `STORAGE_STRATEGY.md` for the full migration plan.

## Important Context

### Project Documentation

Extensive documentation exists in the repo:
- `PROJECT_BRIEF.md` - Product vision and requirements
- `ARCHITECTURE.md` - Detailed codebase structure (more comprehensive than this file)
- `DEVELOPMENT.md` - Development workflow and conventions
- `FEATURES.md` - Feature checklist with implementation status
- `ROADMAP.md` - MVP scope vs. future features
- `STORAGE_STRATEGY.md` - localStorage → Firestore migration strategy

**When in doubt, consult these files** - they contain the full context and decisions.

### Current Development Phase

**✅ Phase 1 Complete:** Foundation (Vite, React, TypeScript, Tailwind v4, Storage Layer)

**🔵 In Progress:** Single-page layout conversion
- Map hero section with WorldMap component
- Country selection via AddCountryModal
- Placeholder sections for Directory, Been To, Want To Go, Stats

**⚪ Next:** Country card components and directory implementation

### Tailwind v4

The project uses **Tailwind CSS v4** (latest) with PostCSS integration:
- Config: Uses CSS-based configuration in `src/index.css`
- No `tailwind.config.js` for theme (uses defaults + CSS variables)
- `@tailwindcss/postcss` package handles processing

### Midnight Map Theme

The map uses a custom dark theme called "Midnight Map" defined in `src/lib/map/colors.ts`:
- Ocean: Dark blue-gray background
- Visited countries: Teal highlights
- Unvisited: Subtle gray
- Borders: Muted for clean appearance

## Testing and Quality (Post-MVP)

No testing framework is currently configured. When implementing tests:
- Use Vitest (see `TESTING.md` for planned strategy)
- Unit tests for hooks and utilities
- Integration tests for user flows
- E2E tests for critical paths (optional, Playwright)

## Common Pitfalls

1. **Don't directly mutate state arrays:**
   ```typescript
   // ❌ Wrong
   beenTo.push('US');
   setBeenTo(beenTo);

   // ✅ Correct
   setBeenTo([...beenTo, 'US']);
   ```

2. **Don't bypass the storage adapter:**
   Always use `storage` from `@/lib/storage`, never raw localStorage/Firestore calls.

3. **Don't edit shadcn/ui components directly:**
   They're auto-generated. Create wrapper components for customization.

4. **Don't add new routes in `App.tsx`:**
   The app is single-page - use anchor links and sections instead.

5. **Environment variables must start with `VITE_`:**
   ```bash
   # .env.local
   VITE_FIREBASE_API_KEY=your-key-here
   ```
   Access in code: `import.meta.env.VITE_FIREBASE_API_KEY`

## Git Workflow

Commit message format:
```
<type>: <description>

Types: feat, fix, docs, style, refactor, test, chore

Examples:
feat: add country search filter
fix: correct map centering on mobile
docs: update architecture documentation
```

Last updated: 2026-01-28
