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
2) **As a traveler,** I can mark countries as “Been to” and “Want to go.”
3) **As a traveler,** I can view my “Been to” list and “Want to go” list separately.
4) **As a traveler,** I can see placeholder baseline + nightly costs and the local currency for each country.
5) **As a traveler,** I can sign in via Google or Apple so my lists are saved and synced.

## 4) Scope
**In scope (MVP)**
- Country directory with search/filter.
- “Been to” and “Want to go” toggles.
- Dedicated list views for each state.
- Placeholder baseline + nightly costs per country.
- Display local currency per country.
- Google/Apple authentication.
- NoSQL storage for user data.

**Should-have (post-MVP)**
- Interactive map view (visited vs wishlist).

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
- **Layout:** Searchable card grid (mobile-first, responsive)
- **Country cards:** Flag emoji, name, region, costs, toggle buttons
- **Feedback:** Visual badges on cards + counter in header (Been To: X | Want To Go: Y)
- **Navigation:** Simple top nav - Directory / Been To / Want To Go
- **Default view:** Full country directory (all countries immediately visible)
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
- **Static JSON** file for country data (~200 countries)
- Placeholder costs: Rough estimates based on country income levels
- Fields: countryCode, countryName, region, currencyCode, currencyName, flagEmoji, baselineCost, nightlyCost

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
- A user can sign in with Google or Apple and return to the same lists later.
- A user can search a country, mark it “Been to” or “Want to go,” and see it in the correct list.
- Each country detail shows placeholder baseline + nightly costs and the local currency.
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
