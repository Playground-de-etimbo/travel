# Changelog

All notable changes to Destino.

---

## v1.0 — 2026-02-18

v1.0 complete. Full documentation cleanup and consolidation.

### Features (chronological)
- Interactive world map with click-to-toggle country selection
- Desktop search panel with autocomplete and region grouping
- Mobile search panel with scroll expansion
- Visited countries list with removal
- Pill-shaped search UX with Fuse.js fuzzy matching
- Country hover tooltips with add/remove hints
- Pan-to-country animation from search
- Disputed territory alerts
- Country aliases for search ("UK", "Holland", etc.)
- Travel recommendations engine with interest/distance/cost scoring
- Budget tier comparison (budget/modest/bougie)
- Flight duration filtering
- Unsplash photo integration with photographer attribution
- IP-based home country auto-detection (ipapi.co)
- Personalized recommendation reasons and playful action verbs
- Auto-generation on preference change
- Postcard generation (front + back with country stamps)
- Shareable postcard URLs with encoded data
- Shared postcard viewing experience
- "Start your own journey" modal for postcard recipients
- "Add to Photos" button for mobile share sheet
- Sound effects for country add/remove
- Light/dark mode with sun/moon celestial animations and starfield
- Floating pill navigation
- Portfolio footer with personal branding
- Earth icon logo component

### Performance
- Code-split bundle with lazy loading (WorldMap, Recommendations, Postcard)
- Manual chunks (react-vendor, map, ui)
- React.memo and memoized callbacks to reduce re-renders
- Debounced search input
- Async Unsplash image enrichment (recommendations render before photos load)
- Stabilized layout heights for CLS
- Font fallback system

### Technical
- Vercel Analytics + Speed Insights
- HTTPS dev server via mkcert
- Unit tests with Vitest + React Testing Library
- E2E tests with Playwright
- StorageAdapter abstraction for localStorage
- Tailwind CSS v4 with CSS-based configuration

---

## Initial Setup — 2026-01-27

- Project initialized with React 18 + Vite 6 + TypeScript
- Tailwind CSS v4 + shadcn/ui configured
- Country data (195+ entries) with GeoJSON boundaries
- Storage abstraction layer designed
- Docker development environment
- Comprehensive project documentation

---

Last updated: 2026-02-18
