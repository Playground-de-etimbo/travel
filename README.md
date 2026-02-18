# Destino - Travel Motivation Planner

> Track where you've been, discover where to go next, and share your journey with the world.

**Live:** Deployed on Vercel | **Status:** v1.0 complete

---

## What is Destino?

A single-page web app that helps you visualize your travel journey:

- **Interactive world map** - Click countries to mark them as visited, with animated highlights
- **Smart search** - Desktop and mobile search panels with autocomplete and country aliases
- **Travel recommendations** - Personalized destination suggestions based on your interests, budget, and location
- **Shareable postcards** - Generate and share a visual postcard of your travel stats
- **Sound effects** - Satisfying audio feedback when adding countries
- **Dark mode** - Full light/dark theme support with sun/moon celestial animations

**Core idea:** People forget why they work. Visualizing your travel goals makes progress feel real and keeps motivation high.

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 18 + TypeScript + Vite 6 |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Map | react-simple-maps + d3-geo |
| Storage | localStorage (via StorageAdapter abstraction) |
| Photos | Unsplash API (optional, graceful fallback) |
| Search | Fuse.js fuzzy matching |
| Hosting | Vercel (Analytics + Speed Insights) |
| Testing | Vitest + React Testing Library + Playwright |

---

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- mkcert (for local HTTPS - required by geolocation API)

### Setup

```bash
# Clone and install
git clone https://github.com/Playground-de-etimbo/travel.git
cd travel
pnpm install

# Install mkcert (one-time, for trusted local HTTPS)
brew install mkcert    # macOS
# sudo apt install mkcert  # Ubuntu

# Start dev server (auto-generates HTTPS certs on first run)
pnpm dev

# Open https://localhost:5173
```

### Optional: Unsplash Photos

The recommendations feature shows flag emojis by default. For real country photos:

1. Register at https://unsplash.com/developers
2. Create an app and copy the Access Key
3. Add to `.env.local`: `VITE_UNSPLASH_ACCESS_KEY=your_key_here`
4. Restart dev server

See [UNSPLASH_SETUP.md](UNSPLASH_SETUP.md) for details.

### Docker Alternative

```bash
docker-compose up
# Open http://localhost:5173
```

See [DOCKER.md](DOCKER.md) for full Docker guide.

---

## Commands

```bash
pnpm dev              # Start HTTPS dev server
pnpm build            # Production build (tsc + vite)
pnpm preview          # Preview production build
pnpm lint             # Run ESLint
pnpm test             # Run unit tests (watch mode)
pnpm test:run         # Run unit tests (single pass)
pnpm test:ui          # Run tests with Vitest UI
pnpm test:e2e         # Run Playwright E2E tests
```

---

## Features (v1.0)

### Implemented
- [x] Interactive world map with click-to-toggle country selection
- [x] Desktop sticky search panel with autocomplete dropdown
- [x] Mobile search panel with scroll expansion
- [x] Country aliases ("UK" finds "United Kingdom", "Holland" finds "Netherlands")
- [x] Travel recommendations engine (interests, budget tiers, flight duration)
- [x] Unsplash photo integration with photographer attribution
- [x] IP-based home country auto-detection
- [x] Shareable postcard generation (front + back with stamps)
- [x] Shared postcard viewing via URL parameters
- [x] Sound effects for country add/remove
- [x] Light/dark mode with celestial animations (sun/moon, starfield)
- [x] Floating pill navigation
- [x] localStorage persistence via StorageAdapter abstraction
- [x] Code-split bundle with lazy loading
- [x] Vercel Analytics + Speed Insights
- [x] Unit tests (Vitest) + E2E tests (Playwright)

### Placeholder Sections (v2)
- [ ] Country Directory (section exists, content pending)
- [ ] Want To Go list
- [ ] Travel Stats comparisons

---

## Project Structure

```
src/
├── components/
│   ├── country/        # SearchableCountryList
│   ├── footer/         # PortfolioFooter, TechStackSection, CountriesNote
│   ├── layout/         # Header, FloatingPillNav, EarthIcon
│   ├── map/            # WorldMap, CountryTooltip
│   ├── postcard/       # PostcardSection, PostcardFront/Back, SharedPostcardBanner
│   ├── recommendations/# RecommendationsSection, PreferencesForm, cards
│   ├── search/         # SearchBox/Panel, MobileSearchPanel, autocomplete
│   └── ui/             # shadcn/ui components (auto-generated)
├── hooks/              # useUserData, useCountries, useRecommendations, etc.
├── lib/
│   ├── api/            # Unsplash, geolocation, REST Countries
│   ├── map/            # Colors, GeoJSON, country code mapping
│   ├── postcard/       # Share URL encoding
│   ├── recommendations/# Algorithm, cost calculator, distance
│   ├── sound/          # Country sound effects
│   └── storage/        # StorageAdapter interface + localStorage impl
├── types/              # Country, UserData, Recommendation interfaces
└── data/               # Country coordinates
```

---

## Documentation

| Document | Purpose |
|----------|---------|
| [CLAUDE.md](CLAUDE.md) | AI coding instructions and codebase guide |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Detailed architecture, patterns, and data flow |
| [WORKFLOWS.md](WORKFLOWS.md) | Dev workflows: TDD, components, data pipeline, deployment |
| [ROADMAP.md](ROADMAP.md) | Version roadmap and future features |
| [KNOWN_ISSUES.md](KNOWN_ISSUES.md) | Open bugs and technical debt |
| [DOCKER.md](DOCKER.md) | Docker development guide |
| [UNSPLASH_SETUP.md](UNSPLASH_SETUP.md) | Unsplash API setup |
| [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) | Vercel deployment guide |
| [CHANGELOG.md](CHANGELOG.md) | Project history |
| [docs/](docs/) | Data generation docs, color palettes, editorial guides |

---

## Data Sources

- **Country metadata:** `public/data/countries.json` (195+ entries)
- **Map boundaries:** GeoJSON via react-simple-maps (Natural Earth)
- **Country aliases:** `public/data/country-aliases.json` (generated from REST Countries API)
- **Travel costs:** `public/data/country-travel-costs.json` (AI-generated synthetic tiers - not for real budgeting)
- **Country coordinates:** `src/data/countryCoordinates.ts` (for distance calculations)

---

## Contributing

This is currently a solo project. Not accepting contributions at this time.

---

## License

This project is for personal use.

---

Last updated: 2026-02-18
