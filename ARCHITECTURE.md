# Architecture & Codebase Structure

## Overview
This document explains how the codebase is organized, the patterns we use, and where to find things.

---

## Project Structure

```
travel/
├── public/                      # Static assets
│   ├── vite.svg                # Default Vite icon (replace with logo)
│   └── data/                   # Static data files
│       ├── countries.json      # Country metadata (name, flag, costs, etc.)
│       └── countries.geo.json  # GeoJSON country boundaries for map
│
├── src/                        # Source code
│   ├── main.tsx               # App entry point
│   ├── App.tsx                # Root component with routing
│   ├── index.css              # Global styles + Tailwind imports
│   │
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components (auto-generated)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── progress.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/           # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── CounterBadge.tsx
│   │   │   └── Footer.tsx
│   │   │
│   │   ├── map/              # Map-related components
│   │   │   ├── WorldMap.tsx           # Main map component
│   │   │   ├── MapControls.tsx        # Zoom, pan controls
│   │   │   ├── CountryLayer.tsx       # GeoJSON country boundaries
│   │   │   ├── FlagOverlay.tsx        # Flag markers on map
│   │   │   └── MapLegend.tsx          # Legend (visited/wishlist)
│   │   │
│   │   ├── country/          # Country-related components
│   │   │   ├── CountryCard.tsx
│   │   │   ├── CountryGrid.tsx
│   │   │   ├── CountrySearch.tsx
│   │   │   ├── CountryBadge.tsx
│   │   │   └── MultiSelectModal.tsx   # Bulk country selection
│   │   │
│   │   ├── stats/            # Statistics components
│   │   │   ├── RegionalStats.tsx      # Region breakdown
│   │   │   ├── StatsCard.tsx          # Individual stat display
│   │   │   ├── ProgressBar.tsx        # Visual progress
│   │   │   └── GlobalStats.tsx        # Total completion
│   │   │
│   │   └── auth/             # Auth components (post-MVP)
│   │       ├── SignInButton.tsx
│   │       └── ProtectedRoute.tsx
│   │
│   ├── pages/                # Page components (views)
│   │   ├── HomePage.tsx          # Map hero + directory
│   │   ├── BeenToPage.tsx        # Been To list
│   │   ├── WantToGoPage.tsx      # Want To Go list
│   │   ├── StatsPage.tsx         # Detailed regional stats
│   │   └── NotFoundPage.tsx      # 404
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── useCountries.ts       # Load & filter countries
│   │   ├── useUserState.ts       # Been To / Want To Go state
│   │   ├── useAuth.ts            # Firebase auth
│   │   └── useLocalStorage.ts    # localStorage utilities
│   │
│   ├── context/              # React Context providers
│   │   ├── AuthContext.tsx       # Auth state
│   │   └── UserStateContext.tsx  # User's country selections
│   │
│   ├── lib/                  # Utilities and config
│   │   ├── storage/              # Storage abstraction
│   │   │   ├── interface.ts      # StorageAdapter interface
│   │   │   ├── localStorage.ts   # localStorage implementation (MVP)
│   │   │   ├── firestore.ts      # Firestore implementation (post-MVP)
│   │   │   └── index.ts          # Export active adapter
│   │   ├── map/                  # Map utilities
│   │   │   ├── geojson.ts        # GeoJSON data loader
│   │   │   ├── styles.ts         # Map styling
│   │   │   └── utils.ts          # Map helper functions
│   │   ├── firebase.ts           # Firebase initialization (post-MVP)
│   │   └── utils.ts              # General utilities
│   │
│   ├── types/                # TypeScript type definitions
│   │   ├── country.ts            # Country interface
│   │   ├── user.ts               # User data interface
│   │   └── index.ts              # Re-exports
│   │
│   └── vite-env.d.ts         # Vite type definitions
│
├── .env.example              # Example environment variables
├── .env.local               # Local environment variables (gitignored)
├── .gitignore
├── package.json
├── tsconfig.json            # TypeScript config
├── vite.config.ts           # Vite config
├── tailwind.config.js       # Tailwind CSS config
├── postcss.config.js        # PostCSS config (for Tailwind)
├── components.json          # shadcn/ui config
├── firebase.json            # Firebase hosting config
├── .firebaserc             # Firebase project config
│
├── PROJECT_BRIEF.md        # Product requirements (updated)
├── TECH_STACK.md          # Technology decisions
├── FEATURES.md            # Feature list with status
├── ARCHITECTURE.md        # This file
├── ROADMAP.md             # MVP vs future features
├── SETUP.md               # Setup instructions
└── DEVELOPMENT.md         # Development workflow
```

---

## Architecture Patterns

### Component Organization

#### 1. **Page Components** (`src/pages/`)
- Top-level route components
- Minimal logic - mostly composition
- Example:
  ```tsx
  // DirectoryPage.tsx
  export const DirectoryPage = () => {
    return (
      <>
        <Header />
        <CountrySearch />
        <CountryGrid />
      </>
    );
  };
  ```

#### 2. **Feature Components** (`src/components/[feature]/`)
- Domain-specific components (country, auth, etc.)
- Can contain business logic
- Example:
  ```tsx
  // CountryCard.tsx
  interface CountryCardProps {
    country: Country;
    isBeenTo: boolean;
    isWantToGo: boolean;
    onToggleBeenTo: () => void;
    onToggleWantToGo: () => void;
  }
  ```

#### 3. **UI Components** (`src/components/ui/`)
- Generic, reusable components from shadcn/ui
- No business logic
- Fully styled and accessible
- **Don't edit manually** - managed by shadcn CLI

#### 4. **Layout Components** (`src/components/layout/`)
- Header, navigation, footer
- Persistent across pages

---

### State Management Strategy

#### Local State (useState)
- Component-specific UI state (open/closed, form inputs)
- No need to share across components

#### Context (React Context)
- **AuthContext**: User authentication state
- **UserStateContext**: Been To / Want To Go arrays
- Shared across many components
- Example:
  ```tsx
  const { user, signIn, signOut } = useAuth();
  const { beenTo, wantToGo, toggleBeenTo, toggleWantToGo } = useUserState();
  ```

#### localStorage
- Guest mode persistence
- Synced to Firestore on sign-in
- Managed by `useLocalStorage` hook

#### Firestore
- Source of truth for authenticated users
- Real-time sync via Firebase listeners
- Optimistic updates for better UX

---

### Data Flow

```
┌─────────────────┐
│  User Action    │ (Click "Been To" button)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Component      │ (CountryCard)
│  Event Handler  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Context Action │ (toggleBeenTo from UserStateContext)
└────────┬────────┘
         │
         ├──────────────────┐
         │                  │
         ▼                  ▼
┌──────────────┐   ┌──────────────┐
│ localStorage │   │  Firestore   │ (if authenticated)
│   Update     │   │    Update    │
└──────────────┘   └──────────────┘
         │                  │
         └──────────┬───────┘
                    ▼
         ┌──────────────────┐
         │  UI Re-render    │ (Badge appears)
         └──────────────────┘
```

---

## Key Design Decisions

### 1. **Mobile-First CSS**
All components designed for mobile, then scaled up:
```tsx
// Tailwind classes
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
```

### 2. **Optimistic Updates**
Update UI immediately, sync to Firestore in background:
```tsx
// Update local state first
setBeenTo([...beenTo, countryCode]);

// Then sync to Firestore
await updateFirestore(userId, { beenTo });
```

### 3. **Error Boundaries**
Catch component errors gracefully:
```tsx
<ErrorBoundary fallback={<ErrorMessage />}>
  <App />
</ErrorBoundary>
```

### 4. **Code Splitting (future)**
Lazy load pages for faster initial load:
```tsx
const BeenToPage = lazy(() => import('./pages/BeenToPage'));
```

---

## TypeScript Conventions

### Interface Naming
```tsx
// Entities
interface Country { ... }
interface User { ... }

// Component Props
interface CountryCardProps { ... }

// API Responses
interface FirestoreUserData { ... }
```

### Type Files
Each domain has its own type file:
- `src/types/country.ts` - Country-related types
- `src/types/user.ts` - User-related types

### Exports
```tsx
// types/index.ts - central export
export * from './country';
export * from './user';
```

---

## Styling Approach

### Tailwind Utility Classes
Primary styling method:
```tsx
<button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md">
```

### CSS Modules (if needed)
For complex animations or one-off styles:
```tsx
import styles from './CountryCard.module.css';
```

### Global Styles
Only in `src/index.css`:
- Tailwind imports
- CSS resets
- Font imports

---

## Firebase Integration

### Initialization
```tsx
// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

### Firestore Data Model
```typescript
// users/{userId}
interface UserDocument {
  beenTo: string[];        // Array of country codes
  wantToGo: string[];      // Array of country codes
  lastUpdated: Timestamp;
  createdAt: Timestamp;
}
```

### Security Rules
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## Routing Structure

```tsx
// src/App.tsx
<Routes>
  <Route path="/" element={<DirectoryPage />} />
  <Route path="/been-to" element={<BeenToPage />} />
  <Route path="/want-to-go" element={<WantToGoPage />} />
  <Route path="*" element={<NotFoundPage />} />
</Routes>
```

---

## Testing Strategy (Post-MVP)

### Unit Tests (Vitest)
- Utility functions
- Custom hooks
- Pure components

### Integration Tests (React Testing Library)
- User flows (search → mark → view list)
- Context interactions

### E2E Tests (Playwright - optional)
- Critical paths only
- Sign in → mark countries → verify persistence

---

## Performance Considerations

### Current Optimizations
- Static country data (no API calls)
- Optimistic UI updates
- Minimal re-renders via context splitting

### Future Optimizations
- Code splitting by route
- Image lazy loading (if country photos added)
- Virtual scrolling for large lists (if 1000+ countries)
- Service worker for offline support

---

## Accessibility (WCAG AA)

### Requirements
- Keyboard navigation for all interactions
- Screen reader support (proper ARIA labels)
- Color contrast ratios meet WCAG AA
- Focus indicators visible
- Alt text for flag emojis

### Implementation
shadcn/ui components come with accessibility built-in. Additional checks:
- `<button>` elements for clickable items
- Semantic HTML (`<nav>`, `<main>`, `<header>`)
- Skip links for keyboard users

---

## Development Workflow

### 1. **Start Development Server**
```bash
npm run dev
```

### 2. **Make Changes**
- Edit files in `src/`
- Vite hot-reloads automatically

### 3. **Add Components**
```bash
npx shadcn-ui@latest add button
```

### 4. **Build for Production**
```bash
npm run build
```

### 5. **Deploy**
```bash
firebase deploy
```

---

## When to Create a New...

### Component
- Reusable UI pattern (e.g., card, button variant)
- Distinct responsibility (e.g., search, filter)
- Complex logic that clutters parent

### Hook
- Reusable stateful logic (e.g., useLocalStorage)
- Encapsulate complex state (e.g., useUserState)
- Firebase interactions (e.g., useAuth)

### Context
- State needed by many components at different levels
- Avoid prop drilling

### Page
- New route/URL

---

## Common Patterns

### Loading States
```tsx
const { countries, loading, error } = useCountries();

if (loading) return <SkeletonGrid />;
if (error) return <ErrorMessage error={error} />;
return <CountryGrid countries={countries} />;
```

### Conditional Rendering
```tsx
{isBeenTo && <Badge variant="success">Been To</Badge>}
{isWantToGo && <Badge variant="primary">Want To Go</Badge>}
```

### Event Handlers
```tsx
const handleToggle = async (countryCode: string) => {
  await toggleBeenTo(countryCode);
};
```

---

Last updated: 2026-01-27
