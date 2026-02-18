# Workflows

Development workflows and skills for contributing to Destino.

---

## TDD Workflow

The project uses Vitest for unit tests and Playwright for E2E tests. Tests are co-located with source code in `__tests__/` directories.

### Running Tests

```bash
pnpm test             # Watch mode — re-runs on file changes
pnpm test:run         # Single pass — good for CI
pnpm test:ui          # Browser UI for test results
pnpm test:e2e         # Playwright E2E tests
pnpm test:e2e:ui      # Playwright with interactive UI
pnpm test:e2e:debug   # Playwright with debugger
```

### Writing a Unit Test

1. Create `__tests__/` directory next to the file you're testing
2. Name the test file to match: `MyComponent.test.tsx` or `myHook.test.ts`
3. Use React Testing Library for component tests, plain Vitest for utilities

```typescript
// src/hooks/__tests__/useSearchFilter.test.ts
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSearchFilter } from '../useSearchFilter';

describe('useSearchFilter', () => {
  it('filters countries by search term', () => {
    const { result } = renderHook(() => useSearchFilter(mockCountries));
    // assertions...
  });
});
```

### Test Configuration

- **Config:** `test` block in `vite.config.ts`
- **Environment:** jsdom
- **Setup file:** `src/test/setup.ts` (imports `@testing-library/jest-dom`)
- **Globals:** `true` (describe, it, expect available without import)
- **Inline deps:** `react-simple-maps` must be inlined (ESM compatibility)

### TDD Red-Green-Refactor Cycle

1. **Red:** Write a failing test that describes the expected behavior
2. **Green:** Write the minimum code to make the test pass
3. **Refactor:** Clean up while keeping tests green
4. Run `pnpm test:run` before committing

---

## Adding a New Component

### 1. Choose the right directory

| Type | Directory |
|------|-----------|
| Page section | `src/components/<feature>/` (e.g., `recommendations/`) |
| Layout/navigation | `src/components/layout/` |
| Shared UI primitive | Use shadcn: `npx shadcn@latest add <component>` |

### 2. Create the component file

```
src/components/recommendations/NewCard.tsx
```

Follow the project's component structure:
```typescript
import { useState } from 'react';
import type { Country } from '@/types';

interface NewCardProps {
  country: Country;
  onSelect: (code: string) => void;
}

export const NewCard = ({ country, onSelect }: NewCardProps) => {
  // hooks first, then handlers, then render
  return <div>...</div>;
};
```

### 3. Key conventions

- Named exports (not default) for components
- Props interface defined above the component
- Use `@/` path alias for all imports
- Mobile-first Tailwind classes
- Co-locate tests in `__tests__/` subdirectory

### 4. If it's a new section in App.tsx

Add the section with an anchor ID and consider lazy loading if it's heavy:
```typescript
const NewSection = lazy(() => import('@/components/new/NewSection'));
```

---

## Working with the Map

### Country Code Mapping

The map uses GeoJSON features that don't always have ISO country codes. The mapping logic lives in `src/lib/map/geoCountryCode.ts`.

Key files:
- `src/components/map/WorldMap.tsx` — main map component
- `src/lib/map/colors.ts` — theme-aware color palette
- `src/lib/map/config.ts` — projection and zoom settings
- `src/lib/map/geoCountryCode.ts` — GeoJSON property → country code

### The Click-to-Toggle Pattern

Country clicks use a capture-phase global listener because `ZoomableGroup`'s transparent overlay steals clicks. See [CLAUDE.md](CLAUDE.md#click-to-toggle-pattern) for the full explanation.

### Adding Map Colors

Map colors use CSS variables defined in `src/index.css` and referenced in `src/lib/map/colors.ts`. To add a new state:

1. Add CSS variables for light and dark mode in `src/index.css`
2. Add the constant to `MAP_COLORS` in `colors.ts`
3. Use it in `WorldMap.tsx` styling logic

---

## Data Pipeline Scripts

Scripts in `scripts/` generate and maintain the static data files. They cache API responses in `scripts/.cache/`.

### Regenerating Country Descriptions

```bash
node scripts/generate_country_descriptions.mjs
```

Fetches Wikipedia page summaries and generates two-sentence travel descriptions. Results go to `public/data/countries.json` (the `description` field).

**Sources:** Logged in `docs/COUNTRY_DESCRIPTION_SOURCES.md`
**Editorial guide:** `docs/COUNTRY_DESCRIPTIONS_EDITORIAL_GUIDE.md`

### Regenerating Country Aliases

```bash
node scripts/generate_country_aliases.mjs
```

Fetches alternative names from REST Countries API. Results go to `public/data/country-aliases.json`.

### Updating World Bank Regions

```bash
node scripts/update-worldbank-regions.mjs
```

Updates the `region` field in country data from World Bank classifications.

### Editorial Pass on Descriptions

```bash
node scripts/editorial_pass_descriptions.mjs
```

Applies editorial cleanup rules to country descriptions. See `docs/DESCRIPTION_EDITORIAL_CHANGES.md` for changes made.

---

## Working with Unsplash

The recommendations feature fetches country photos from Unsplash. Configuration:

- **API key:** Set `VITE_UNSPLASH_ACCESS_KEY` in `.env.local`
- **Implementation:** `src/lib/api/unsplash.ts`
- **Rate limit:** 50 requests/hour (free tier)
- **Fallback:** Flag emojis on gradient backgrounds when no key or rate limited
- **Attribution:** Photographer name shown in tooltip on recommendation cards

See [UNSPLASH_SETUP.md](UNSPLASH_SETUP.md) for setup instructions.

---

## Deployment

### Vercel (Production)

The app deploys to Vercel automatically on push to `main`.

```bash
# Manual deploy
vercel --prod

# Preview deploy (any branch)
git push origin feature-branch  # Auto-creates preview URL
```

**Environment variables** for Vercel:
- `VITE_UNSPLASH_ACCESS_KEY` — set in Vercel dashboard under Settings > Environment Variables

See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for the full guide.

### Docker (Local Development)

```bash
docker-compose up        # Start dev server
docker-compose down      # Stop
docker-compose up --build  # Rebuild after Dockerfile changes
```

**Note:** Docker runs HTTP (not HTTPS), so geolocation auto-detection won't work in Docker.

See [DOCKER.md](DOCKER.md) for the full guide.

---

## Adding a shadcn/ui Component

```bash
npx shadcn@latest add <component-name>
```

This generates a file in `src/components/ui/`. Never edit these files directly — create wrapper components if you need customization.

Common shadcn components already installed: accordion, alert-dialog, badge, button, card, dialog, dropdown-menu, input, sonner.

---

## Git Commit Conventions

```
<type>: <description>

Types:
  feat     New feature
  fix      Bug fix
  perf     Performance improvement
  refactor Code restructuring (no behavior change)
  style    Formatting, CSS changes
  docs     Documentation only
  test     Adding or updating tests
  chore    Build, config, dependencies
```

---

Last updated: 2026-02-18
