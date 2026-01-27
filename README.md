# Travel Motivation Planner

> A web app that motivates travel by helping you track where you've been and where you want to go.

**Status:** 🏗️ MVP in development

---

## What is This?

A simple, beautiful web app that lets you:
- Mark countries you've been to
- Create a wishlist of places you want to go
- See placeholder travel costs to make trips feel tangible
- Track your travel progress and stay motivated

**Core idea:** People forget why they work. Visualizing your travel goals makes progress feel real and keeps motivation high.

---

## Quick Links

### 📚 Documentation

| Document | Purpose |
|----------|---------|
| [PROJECT_BRIEF.md](PROJECT_BRIEF.md) | Product vision, requirements, and user stories |
| [TECH_STACK.md](TECH_STACK.md) | Technology decisions and rationale |
| [FEATURES.md](FEATURES.md) | Feature list with status tracking ⭐ Track progress here |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Codebase structure and patterns |
| [ROADMAP.md](ROADMAP.md) | MVP vs future features |
| [GETTING_STARTED.md](GETTING_STARTED.md) | Step-by-step guide to start coding ⭐ Start here |
| [DOCKER.md](DOCKER.md) | Docker setup and development guide 🐳 |
| [SETUP.md](SETUP.md) | Detailed local setup instructions |
| [DEVELOPMENT.md](DEVELOPMENT.md) | Development workflow and conventions |
| [TESTING.md](TESTING.md) | Testing strategy and Vitest guide 🧪 |
| [STORAGE_STRATEGY.md](STORAGE_STRATEGY.md) | localStorage → Firebase migration plan 💾 |
| [CHANGELOG.md](CHANGELOG.md) | Project changes and updates 📝 |

---

## Tech Stack

- **Frontend:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Auth:** Firebase Authentication (Google)
- **Database:** Firestore (NoSQL)
- **Hosting:** Firebase Hosting
- **Data:** Static JSON (~200 countries)

**Why this stack?** Optimized for rapid prototyping, minimal cost, ease of learning, and automatic scaling.

See [TECH_STACK.md](TECH_STACK.md) for full rationale.

---

## Features

### MVP (v1.0) - In Progress
- [ ] **World map hero** - Interactive map with visited country highlighting
- [ ] **Multi-select flow** - Bulk country selection modal
- [ ] **Regional stats** - Completion tracking by continent
- [ ] **Click-to-toggle map** - Mark countries directly on map
- [ ] Country directory with search
- [ ] "Been to" and "Want to go" lists
- [ ] Placeholder travel costs per country
- [ ] localStorage persistence (Firebase-ready abstraction)
- [ ] "Midnight Map" color theme
- [ ] Mobile-first responsive design

See [FEATURES.md](FEATURES.md) for complete list and status.

### Post-MVP
- **Firebase Authentication** - Google/Apple OAuth (v1.1)
- **Firestore sync** - Cross-device data sync (v1.1)
- **Social sharing** - Map card image generation (v1.1)
- Visit dates and notes (v1.2)
- Budget calculator (v2.0)
- AI destination suggestions (v2.0+)

See [ROADMAP.md](ROADMAP.md) for full roadmap.

---

## Getting Started

### Prerequisites

**Option A: Docker (Recommended)**
- Docker Desktop
- Firebase account (free tier)
- See [DOCKER.md](DOCKER.md)

**Option B: Local Development**
- Node.js 18+
- pnpm (`npm install -g pnpm`)
- Firebase account (free tier)

### Quick Start

#### Option A: Docker (Recommended)
```bash
# 1. Clone the repo
git clone https://github.com/Playground-de-etimbo/travel.git
cd travel

# 2. Set up Firebase config (see DOCKER.md)
# Create .env.local with Firebase credentials

# 3. Start with Docker
docker-compose up

# Access at http://localhost:5173
```
See [DOCKER.md](DOCKER.md) for details.

#### Option B: Local Development
```bash
# 1. Clone the repo
git clone https://github.com/Playground-de-etimbo/travel.git
cd travel

# 2. Install pnpm (if not installed)
npm install -g pnpm

# 3. Initialize Vite + React
pnpm create vite@latest . -- --template react-ts
pnpm install

# 4. Install dependencies
pnpm install react-router-dom firebase
pnpm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npx shadcn-ui@latest init

# 5. Set up Firebase (see GETTING_STARTED.md for details)
# - Create Firebase project
# - Enable Google auth
# - Create Firestore database
# - Copy config to .env.local

# 6. Start development
pnpm dev
```

See [SETUP.md](SETUP.md) for detailed setup instructions.

---

## Development

### Start Coding

**Docker:**
```bash
docker-compose up     # Start dev server
docker-compose down   # Stop dev server
```

**Local:**
```bash
pnpm dev       # Start dev server (http://localhost:5173)
pnpm build     # Build for production
pnpm preview   # Preview production build
```

### Current Focus
**Next feature:** Country data structure and card component

See [FEATURES.md](FEATURES.md) for what's being worked on.

### Workflow
1. Pick a feature from [FEATURES.md](FEATURES.md)
2. Follow conventions in [DEVELOPMENT.md](DEVELOPMENT.md)
3. Check [ARCHITECTURE.md](ARCHITECTURE.md) for file structure
4. Update feature status when complete

---

## Project Structure

```
travel/
├── docs/                    # Documentation files
│   ├── PROJECT_BRIEF.md
│   ├── TECH_STACK.md
│   ├── FEATURES.md
│   ├── ARCHITECTURE.md
│   ├── ROADMAP.md
│   ├── SETUP.md
│   ├── DEVELOPMENT.md
│   └── GETTING_STARTED.md
│
├── src/                     # Source code (to be created)
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── context/
│   ├── lib/
│   └── types/
│
├── public/                  # Static assets
│   └── data/
│       └── countries.json   # Country data
│
└── ... (config files)
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed structure.

---

## Contributing

This is currently a solo learning project. Not accepting contributions at this time.

---

## Cost

**MVP:** $0/month (Firebase free tier)
- 50K Firestore reads/day
- 20K writes/day
- Unlimited authentication
- 10GB/month hosting bandwidth

**If successful (~1000 users):** ~$10-25/month

See [TECH_STACK.md](TECH_STACK.md) for cost breakdown.

---

## Success Metrics (MVP)

- 100+ sign-ups in first month
- 50+ users mark 5+ "Been to" countries
- 50+ users add 3+ "Want to go" countries
- 20% 4-week retention rate

See [ROADMAP.md](ROADMAP.md) for detailed metrics.

---

## License

This project is for personal learning and use.

---

## Acknowledgments

Built with:
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Firebase](https://firebase.google.com/)

---

## Questions?

- 📖 Check the [GETTING_STARTED.md](GETTING_STARTED.md) guide
- 🏗️ Review [ARCHITECTURE.md](ARCHITECTURE.md) for code structure
- 📋 See [FEATURES.md](FEATURES.md) for what's being built
- 🗺️ Check [ROADMAP.md](ROADMAP.md) for future plans

---

**Let's build something that inspires wanderlust!** ✈️🌍

Last updated: 2026-01-27
