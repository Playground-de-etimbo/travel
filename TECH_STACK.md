# Tech Stack

## Overview
This document outlines the technical decisions for the Travel Motivation Planner MVP, with rationale for each choice.

## Decision Summary
**Optimized for:** Fast prototyping, minimal cost, learning opportunity, scalable if successful.

---

## Frontend

### Core Framework
**React 18+ with Vite**
- **Why:** Vite provides extremely fast development server and build times. React remains industry standard with massive ecosystem.
- **TypeScript:** Type safety without the overhead of complex tooling. Good learning path from JavaScript.
- **Mobile-first:** All components built with mobile responsiveness as priority.

### Styling & UI Components
**Tailwind CSS + shadcn/ui**
- **Why Tailwind:** Utility-first CSS that's fast to write, small bundle size, highly customizable.
- **Why shadcn/ui:** Copy-paste component approach (not a dependency). High-quality, accessible components built on Radix UI. Professional look without the bulk of Material-UI.
- **Cost:** Free and open source.

### State Management
**React Context + Hooks** (for MVP)
- **Why:** Built-in, no additional libraries. Sufficient for MVP scope.
- **Future:** Consider Zustand or Redux if state complexity grows.

### Routing
**React Router v6**
- **Why:** Industry standard, simple to use, supports protected routes.

---

## Backend & Infrastructure

### Backend-as-a-Service
**Firebase**

#### Firebase Authentication
- **Providers:** Google OAuth (MVP), Apple OAuth (post-MVP)
- **Why:** Zero backend code needed, industry-standard security, free tier covers MVP needs.
- **Guest mode:** localStorage for unauthenticated users, sync to Firebase on sign-in.

#### Firestore (Database)
- **Type:** NoSQL document database
- **Why:**
  - Real-time sync capabilities
  - Generous free tier (50K reads/day, 20K writes/day)
  - Automatic scaling
  - Offline support built-in
  - Excellent Firebase integration
- **Data model:**
  ```
  users/{userId}
    - beenTo: string[]
    - wantToGo: string[]
    - lastUpdated: timestamp
    - metadata: {...}
  ```

#### Firebase Hosting
- **Why:** One-command deployment, global CDN, free SSL, integrates with Firebase Auth.
- **Cost:** Free tier: 10GB/month bandwidth, 1GB storage.

---

## Data

### Country Data
**Static JSON file in codebase**
- **Why:** ~200 countries rarely change. No API calls needed. Instant loading.
- **Structure:**
  ```json
  {
    "countryCode": "US",
    "countryName": "United States",
    "region": "North America",
    "currencyCode": "USD",
    "currencyName": "US Dollar",
    "flagEmoji": "🇺🇸",
    "baselineCost": 100,
    "nightlyCost": 150
  }
  ```
- **Cost data:** Rough estimates based on country income levels (good enough for MVP).
- **Source:** Will compile from reliable sources (REST Countries API for metadata, cost estimates based on research).

---

## Development Tools

### Package Manager
**pnpm** (fast and efficient)
- **Why:** 2-3x faster than npm, disk space efficient via hard links, stricter dependency management
- **Install:** `npm install -g pnpm` (one-time setup)
- **Alternative:** npm works fine too, but pnpm is worth the minor setup

### Code Quality
- **ESLint:** Linting with TypeScript rules
- **Prettier:** Code formatting
- **Git hooks:** Pre-commit formatting (optional, can add later)

### Testing (Post-MVP)
- **Vitest:** Fast unit testing (Vite-native)
- **React Testing Library:** Component testing
- **Playwright:** E2E testing if needed

---

## Deployment

### Hosting
**Firebase Hosting** (primary)
- **Why:** Simplest deployment for Firebase projects. One command: `firebase deploy`.
- **Alternative:** Vercel (easy switch if needed, both support React + Vite).

### CI/CD (Post-MVP)
- **GitHub Actions:** Auto-deploy on push to main branch.

---

## Cost Breakdown

### MVP (Expected: $0/month)
- Firebase Free Tier:
  - Authentication: Unlimited
  - Firestore: 50K reads/day, 20K writes/day, 1GB storage
  - Hosting: 10GB/month bandwidth, 1GB storage
- Domain (optional): ~$12/year if custom domain desired
- **Total:** $0/month until you exceed free tier limits

### If Successful (~1000 active users)
- Firebase Blaze (pay-as-you-go):
  - Firestore: ~$5-20/month
  - Hosting: ~$0-5/month
  - Authentication: Still free
- **Estimated:** $10-25/month

---

## Rationale for Firebase vs. Alternatives

### Why not Next.js + MongoDB?
- More setup complexity (need to host backend somewhere)
- MongoDB Atlas free tier is good, but requires separate auth setup
- Next.js API routes need hosting (Vercel free tier works, but adds another service)
- **Verdict:** More moving pieces, slower to prototype

### Why not Supabase?
- Excellent alternative (Postgres, real-time, auth)
- Slightly less mature ecosystem than Firebase
- Firebase has better documentation for beginners
- **Verdict:** Firebase is more proven for rapid prototyping

### Why not local backend (Express/Node)?
- Need to host it somewhere (Railway, Render, etc.)
- More code to write and maintain
- Auth implementation from scratch
- **Verdict:** Overkill for MVP, slows down iteration

---

## Future Considerations

### When to migrate/scale
- **If Firebase costs exceed $100/month:** Consider:
  - Optimizing Firestore queries
  - Implementing caching
  - Moving to self-hosted Postgres + Node.js backend
- **If need complex backend logic:** Add Cloud Functions (Firebase) or separate Node.js service
- **If need better SEO:** Consider Next.js migration (can keep Firebase for backend)

### Map integration (Post-MVP)
- **MapLibre GL + OpenStreetMap:** Free, open source
- **Alternative:** Mapbox (better DX, but costs money after free tier)

---

## Summary
This stack optimizes for:
- **Speed:** Vite + Firebase = minimal setup
- **Cost:** Free tier covers months of usage
- **Learning:** Modern React + TypeScript + industry-standard BaaS
- **Scalability:** Firebase scales automatically, easy migration path if needed

Last updated: 2026-01-27
