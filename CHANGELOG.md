# Changelog

## [Unreleased] - 2026-01-27

### Major Scope Changes

#### Added to MVP (v1.0)
- **World Map Hero** - Interactive map at top of page with visited country highlighting
- **Multi-Select Flow** - Modal dialog for bulk country selection with search
- **Regional Stats** - Completion tracking by continent/region
- **Click-to-Toggle Map** - Click countries directly on map to mark as visited
- **Flag Overlays** - Show flag emojis on visited countries on map
- **Stats Page** - Dedicated page for detailed regional breakdown
- **"Midnight Map" Color Theme** - Premium blue color palette with dark mode

#### Moved to Post-MVP (v1.1+)
- **Authentication** - Google/Apple OAuth deferred to v1.1
- **Firestore** - Database deferred to v1.1 (localStorage in MVP)

#### New Features (Future)
- **Social Sharing** - Generate and share map card images (v1.1)
- **AI Destination Bot** - Suggest travel destinations (v2.0+)

---

### Technical Changes

#### Stack Updates
- Added **MapLibre GL JS** for interactive maps (MVP)
- Added **Storage Abstraction Layer** for easy Firebase migration
- Color theme specified: "Midnight Map" (HSL variables)
- GeoJSON data for country boundaries

#### Architecture Changes
- New components: `WorldMap`, `MultiSelectModal`, `RegionalStats`
- New folder: `src/lib/storage/` for storage abstraction
- New folder: `src/lib/map/` for map utilities
- New folder: `src/components/map/` for map components
- New folder: `src/components/stats/` for statistics components
- New page: `StatsPage.tsx` for detailed stats
- Renamed: `DirectoryPage.tsx` → `HomePage.tsx` (map hero + directory)

#### Data Model Updates
- localStorage-first approach with Firebase migration path
- Export/import functionality for data portability
- GeoJSON country boundaries in `public/data/countries.geo.json`

---

### Documentation Updates

#### New Files
- `STORAGE_STRATEGY.md` - Storage abstraction and migration guide
- `CHANGELOG.md` - This file
- `docs/color-palettes.md` - "Midnight Map" theme specification
- `docs/color-palettes-preview.html` - Visual color preview

#### Updated Files
- `PROJECT_BRIEF.md` - New user stories, updated scope and acceptance criteria
- `FEATURES.md` - Complete rewrite with new MVP features
- `ROADMAP.md` - Map moved to v1.0, auth moved to v1.1
- `TECH_STACK.md` - Added MapLibre, updated storage section, added color theme
- `ARCHITECTURE.md` - New component structure (map, stats, storage)
- `README.md` - Updated feature list and documentation links

---

### Development Workflow Changes

#### New Feature Development Order
1. **Phase 1:** Storage abstraction layer (critical foundation)
2. **Phase 2:** Country data + basic display
3. **Phase 3:** Map integration
4. **Phase 4:** Multi-select & stats
5. **Phase 5:** Polish & deploy
6. **Phase 6:** Auth & Firebase (post-MVP)

#### First Feature
**Changed from:** Country cards with toggle buttons
**Changed to:** Storage abstraction layer + country data model

**Rationale:** Build flexible foundation that supports both card-based and map-based UX

---

## [Codebase Initialization] - 2026-01-27

### Added
- Complete React + Vite + TypeScript project structure
- Tailwind CSS v4 with "Midnight Map" theme (CSS-based configuration)
- shadcn/ui component system (button, card, input, badge, dialog)
- Storage abstraction layer (localStorage + Firestore stub)
- TypeScript type definitions (Country, UserData, UserPreferences)
- Sample country data (20 countries for MVP testing)
- Natural Earth GeoJSON country boundaries (10m resolution, 13MB)
- React Router with Header navigation component
- Firebase hosting configuration files
- GeoJSON loading utility

### Technical Implementation
- React 18.3.1 + Vite 6.4.1 + TypeScript 5.6.3
- Tailwind CSS v4 with @theme directive (PostCSS plugin)
- MapLibre GL JS 5.16.0
- React Router 7.13.0
- Firebase SDK 12.8.0
- Path aliases configured (@/ = ./src/)

### Verification
- ✅ TypeScript compiles without errors
- ✅ Build completes successfully (dist/ folder generated)
- ✅ Dev server starts on http://localhost:5173
- ✅ "Midnight Map" theme applies correctly
- ✅ Storage layer works (localStorage adapter)
- ✅ Country data loads from JSON

---

## [Initial Setup] - 2026-01-27

### Added
- Complete project documentation (10 MD files)
- Docker development environment
- Testing strategy (Vitest + React Testing Library)
- Code quality tools (Prettier, EditorConfig)
- Git configuration (.gitignore, .dockerignore)

### Technical Stack Decisions
- Frontend: React 18 + Vite + TypeScript
- Styling: Tailwind CSS + shadcn/ui
- Package Manager: pnpm
- Testing: Vitest + React Testing Library
- Deployment: Firebase Hosting

---

## Future Releases

### v1.1 - Authentication & Sync (Planned)
- Firebase Authentication (Google OAuth)
- Migrate localStorage to Firestore
- Cross-device sync
- Social sharing (map card images)

### v1.2 - Enhanced Features (Planned)
- Apple OAuth
- Visit dates and notes
- Country detail modals

### v2.0 - Planning Tools (Planned)
- Budget calculator
- Planned trips list
- AI destination suggestions

---

Last updated: 2026-01-27
