# Project Briefing: Travel Motivation Planner

## 1) Product Overview (PM Brief for AI Engineers)
**Vision:** A web app that motivates travel by letting users track where they've been and where they want to go, with simple cost placeholders to make future trips feel tangible.

**Why it matters:** People forget why they work. A visual, personal travel tracker makes progress feel real and keeps motivation high.

**Primary users:** Travelers who love traveling and have visited or want to visit many places.

**Current status:** In development - MVP phase.

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
2) **As a traveler,** I can mark countries as "Been to" and "Want to go."
3) **As a traveler,** I can view my "Been to" list and "Want to go" list on the same page (single-page layout).
4) **As a traveler,** I can see placeholder baseline + nightly costs and the local currency for each country.
5) **As a traveler,** I can see a world map with my visited countries at the top of the page.
6) **As a traveler,** I can bulk-add multiple countries from a searchable, multi-select list with a running total.
7) **As a traveler,** I can track regional completion stats for visited vs unvisited countries.
8) **As a traveler,** I can see how my travel experience compares to global averages (e.g., "Most people visit 10 countries in their lifetime - you've visited 5x that!") to understand my travel habits and stay motivated.

## 4) Scope
**In scope (MVP)**
- **Single-page layout:** All content on one scrollable page (no separate routes).
- World map hero at the top of the page with visited-country flags overlaid and an adjacent "Add country" button.
- Country directory with search/filter.
- Multi-select "Add country" flow that supports rapid selection, searching, and shows total country counts.
- "Been to" and "Want to go" toggles.
- List sections for "Been to" and "Want to go" on the same page.
- Regional completion tracker showing visited vs unvisited counts.
- **Comparative travel stats:** Show how user's travel compares to global averages (e.g., "You've traveled more than 95% of people").
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
- Income allocation calculator with sliders (expenses, travel, savings, splurges) and estimated travel days per year.
- Travel-style cost bands per country (budget → mid → fancy → rich kid) with examples (dining habits, hotel stars).
- AI destination bot to suggest where to go next and auto-update the planned destination list, with usage limits of X suggestions per logged-in user and one suggestion per anonymous user.

**Out of scope (for now)**
- Bookings, payments, itinerary management.
- Live price aggregation.

## 5) Functional Requirements
**Country directory**
- Must display all countries with search and/or region filter.
- Must support fast selection (no full page reloads).
- Must support grouping and summary views by region (counts/percentages).

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
- Must allow full use without logging in (no login wall).
- Must support optional Google and Apple sign-in for saving/syncing.
- Must persist lists and states in NoSQL storage when signed in.
- Must support Google and Apple sign-in.
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

### Design Decisions (MVP)
- **Layout:** Single-page scrollable design with all sections on one page (mobile-first, responsive)
- **Page structure:** Map hero → Stats comparison → Country directory → Been To list → Want To Go list → Regional stats
- **Country cards:** Flag emoji, name, region, costs, toggle buttons
- **Feedback:** Visual badges on cards + counter in header (Been To: X | Want To Go: Y)
- **Navigation:** Anchor links in header to scroll to sections (Map / Directory / Been To / Want To Go / Stats)
- **Default view:** Lands at top with map hero, can scroll down to see all sections
- **Guest mode:** App works without sign-in, prompts to sign in to sync across devices

### UX Principles
- **Tone:** Engaging and clear, inspire wanderlust
- **Speed:** Interactions should feel instant (sub-200ms)
- **Simplicity:** Minimal clicks to mark a country
- **Progress:** Make accomplishments visible (counter, lists)
- **Mobile-first:** Perfect experience on phone, enhanced on desktop

### Future UX Enhancements (Post-MVP)
- Visit dates and notes (v1.2)
- Interactive map view (v1.1)
- Onboarding wizard for first-time users (v1.1)

## 9) Tech Stack (Final Decision)
**Selected: Option A - Fast MVP with Firebase**

### Frontend
- **React 18+** with **Vite** for fast development
- **TypeScript** for type safety
- **Tailwind CSS** + **shadcn/ui** for styling and components
- **React Router v6** for routing
- **Mobile-first** responsive design (priority)

### Backend & Infrastructure
- **Firebase Authentication** (Google OAuth for MVP)
- **Firestore** for NoSQL database
- **Firebase Hosting** for deployment
- **Guest mode** with localStorage (sync to Firestore on sign-in)

### Data
- **Static JSON** file for country data (~250 countries)
- Placeholder costs: AI-guided estimates, plus local-currency budget tiers in a separate JSON file
- Fields: countryCode, countryName, region, currencyCode, currencyName, flagEmoji, description, baselineCost, nightlyCost
- Local-currency cost tiers: `public/data/country-travel-costs.json` keyed by countryCode
- Audit notes: `docs/TRAVEL_COSTS_AI_AUDIT.md`
- Regeneration notes: `docs/TRAVEL_COSTS_GENERATION.md`
- Description sources: `docs/COUNTRY_DESCRIPTION_SOURCES.md`

### Future Integrations
- Map (v1.1): **MapLibre GL + OpenStreetMap** (free, open source)
- Apple OAuth (v1.2)
- Real cost data via Numbeo API (v2.0)

**Rationale:** Optimized for rapid prototyping, minimal cost, ease of learning, and automatic scaling.

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
- The entire app is on one scrollable page with all sections visible.
- A user sees a world map hero at the top of the page with visited flags and an "Add country" control.
- A user can scroll or click anchor links to navigate between sections (Map, Directory, Been To, Want To Go, Stats).
- A user can open the multi-select, search, and quickly select multiple countries while seeing total counts.
- A user can search a country, mark it "Been to" or "Want to go," and see it in the corresponding section.
- A user can view regional completion stats for visited vs unvisited countries.
- A user can see comparative stats showing how their travel compares to global averages (e.g., "Most people visit 10 countries - you've visited 25!").
- Each country detail shows a short description and placeholder baseline + nightly costs, with local-currency budget tiers where available.
- A country can be unmarked and removed from the lists.

## 12) Decisions Made
- ✅ Tech stack: React + Vite + Firebase (see section 9)
- ✅ UI framework: Tailwind CSS + shadcn/ui
- ✅ Country data: Static JSON with placeholder costs
- ✅ Auth: Google OAuth only for MVP (Apple post-MVP)
- ✅ Guest mode: Yes, with localStorage
- ✅ UX pattern: Searchable card grid
- ✅ Feedback: Visual badges + header counter
- ✅ Mobile-first: Priority for responsive design
- ✅ Notes/dates: Post-MVP feature (v1.2)

## 13) Open Questions (To Resolve Later)
- Default display currency for cost totals (USD? User's local currency?)
- Budget calculator: Trip planning features (v2.0)
- Map customization options (v1.1)
- Social features: Public profiles vs private only (v3.0)
