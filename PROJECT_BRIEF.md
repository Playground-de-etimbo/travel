# Project Briefing: Travel Motivation Planner

## 1) Product Overview (PM Brief for AI Engineers)
**Vision:** A web app that motivates travel by letting users track where they’ve been and where they want to go, with simple cost placeholders to make future trips feel tangible.

**Why it matters:** People forget why they work. A visual, personal travel tracker makes progress feel real and keeps motivation high.

**Primary users:** Travelers who love traveling and have visited or want to visit many places.

**Current status:** Idea stage.

## 2) Objectives & Success Metrics
**Objectives**
1) Make country selection effortless and fast.
2) Help users reflect on trips they’ve done.
3) Make future travel feel achievable via simple costs.

**Success metrics (MVP)**
- % of users who mark at least 5 “Been to” countries.
- % of users who add at least 3 “Want to go” countries.
- 4-week retention for returning users.

## 3) Core User Stories (MVP)
1) **As a traveler,** I can browse or search all countries so I can quickly find any place.
2) **As a traveler,** I can mark countries as “Been to” and “Want to go.”
3) **As a traveler,** I can view my “Been to” list and “Want to go” list separately.
4) **As a traveler,** I can see placeholder baseline + nightly costs and the local currency for each country.
5) **As a traveler,** I can see a world map with my visited countries surfaced at the top of the page.
6) **As a traveler,** I can bulk-add multiple countries from a searchable, multi-select list with a running total.
7) **As a traveler,** I can track regional completion stats for visited vs unvisited countries.

## 4) Scope
**In scope (MVP)**
- World map hero at the top of the page with visited-country flags overlaid and an adjacent “Add country” button.
- Country directory with search/filter.
- Multi-select “Add country” flow that supports rapid selection, searching, and shows total country counts.
- “Been to” and “Want to go” toggles.
- Dedicated list views for each state.
- Regional completion tracker showing visited vs unvisited counts.
- Placeholder baseline + nightly costs per country.
- Display local currency per country.
- NoSQL storage for user data.

**Should-have (post-MVP)**
- Google/Apple authentication (move to later phase).
- Social sharing and “Save to Photos” card for a small image of visited countries.

**Could-have (future)**
- Budget planner for wishlist (trip length, total estimate).
- Next holiday countdown with a “Planned trips” list.
- Export map art for printing (visited countries).

**Out of scope (for now)**
- Bookings, payments, itinerary management.
- Live price aggregation.

## 5) Functional Requirements
**Country directory**
- Must display all countries with search and/or region filter.
- Must support fast selection (no full page reloads).

**Country states**
- Must allow a country to be in exactly one state: neutral, “Been to,” or “Want to go.”
- Must allow toggling a state off (return to neutral).

**Lists**
- Must show separate lists for “Been to” and “Want to go.”
- Must allow removing a country from a list (toggle off).

**Costs**
- Must show baseline cost and nightly cost per country (placeholder values).
- Must show the local currency for each country.

**Auth + storage**
- Must persist lists and states in NoSQL storage.

**Monetization**
- Must include a “Buy Me a Coffee” button (non-blocking).

## 6) Data & Assumptions
**Countries data**
- Use **static JSON** for the MVP, with fields:
  - `countryCode`, `countryName`, `region`, `currencyCode`, `currencyName`, `flagEmoji`

**Cost data**
- Placeholder values stored per country:
  - `baselineCost`, `nightlyCost`
  - Currency displayed using `currencyCode`

**User data**
- Store: `userId`, `beenTo[]`, `wantToGo[]`, `plannedTrips[]`, `lastUpdated`

## 7) Non-Functional Requirements
- **Accessibility:** WCAG AA as baseline.
- **Performance:** Country list interactions should feel instant (sub-200ms per interaction).
- **Security:** Secure auth flows, least-privilege rules in data store, no PII beyond auth.
- **Privacy:** Only store what is needed to save user lists.

## 8) UX + Content Guidance
- Tone: engaging and clear.
- Emphasize inspiration, progress, and positive reinforcement.
- Keep the “marking” flow simple and fast.

## 9) Tech Stack Options (React + Node.js backend preferred)
**Option A (Fast MVP — recommended)**
- Frontend: React + Vite + TypeScript
- Backend: Node.js + Express or Fastify
- Auth: **Firebase Authentication** (Google/Apple)
- Database: **Firestore** (NoSQL)
- Map (future): **MapLibre GL + OpenStreetMap tiles** (free, supports fills/animations)

**Option B (Unified full-stack)**
- Frontend: React (Next.js)
- Backend: Next.js API routes or Node.js server
- Auth: NextAuth with Google/Apple
- Database: MongoDB Atlas
- Map (future): Mapbox GL

**Option C (Scalable services)**
- Frontend: React + TypeScript
- Backend: Node.js (NestJS)
- Auth: Auth0
- Database: MongoDB Atlas
- Map (future): Mapbox or Google Maps

## 10) Potential Integrations (Future)
- **Country & currency data:** Rest Countries API, ISO datasets, Open Exchange Rates.
- **Travel cost data:** Numbeo, BudgetYourTrip, or curated dataset.
- **Maps:** Mapbox, Google Maps, or OpenStreetMap/Leaflet.
- **Inspiration content:** Wikipedia/Wikivoyage summaries, Unsplash imagery.
- **Weather:** OpenWeather for seasonal planning.
- **Safety:** Government travel advisories where available.
- **Printing:** Print-on-demand or PDF export for map art.
- **E-ink display:** Simple API feed for next-trip countdown and highlights.

## 11) Acceptance Criteria (MVP)
- A user sees a world map hero at the top of the page with visited flags and an “Add country” control.
- A user can open the multi-select, search, and quickly select multiple countries while seeing total counts.
- A user can search a country, mark it “Been to” or “Want to go,” and see it in the correct list.
- A user can view regional completion stats for visited vs unvisited countries.
- Each country detail shows placeholder baseline + nightly costs and the local currency.
- A country can be unmarked and removed from the lists.

## 12) Open Decisions
- Default display currency for totals (e.g., USD)?
