# Testing Strategy & Guide

## Philosophy: Test As You Go

We're writing tests alongside features during MVP development. This approach:
- ✅ Builds good habits from the start
- ✅ Helps you learn React, TypeScript, AND testing together
- ✅ Catches bugs early when they're easier to fix
- ✅ Provides documentation through test examples
- ⚠️ Slower initial development (worth it for learning)

---

## Testing Stack

### Tools
- **Vitest** - Fast, Vite-native test runner (like Jest but faster)
- **React Testing Library** - Test components the way users interact with them
- **@testing-library/user-event** - Simulate user interactions
- **@vitest/ui** - Optional visual test runner

### Why Vitest?
- Built for Vite (no config needed)
- 10x faster than Jest
- Same API as Jest (easy to learn)
- ESM native, TypeScript support

---

## Setup

### Install Testing Dependencies
```bash
pnpm add -D vitest @vitest/ui jsdom
pnpm add -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

### Configure Vitest

**`vite.config.ts`** - Add test configuration:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
})
```

**`src/test/setup.ts`** - Test setup file:
```typescript
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers)

// Cleanup after each test
afterEach(() => {
  cleanup()
})
```

**`package.json`** - Add test scripts:
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest --coverage"
  }
}
```

---

## What to Test

### Priority Levels

#### 🔴 Critical (Must Test)
- Authentication flows (sign in, sign out)
- Data persistence (Firestore save/load)
- Country state toggling (Been To / Want To Go)
- LocalStorage sync to Firestore

#### 🟡 Important (Should Test)
- Country search and filtering
- List views (Been To, Want To Go pages)
- Navigation between pages
- Error boundaries

#### 🟢 Nice to Have (Can Test)
- UI component rendering
- Edge cases and error states
- Accessibility features

---

## Testing Patterns

### 1. Component Tests

**Test user interactions, not implementation details.**

```typescript
// src/components/country/CountryCard.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CountryCard } from './CountryCard'

describe('CountryCard', () => {
  const mockCountry = {
    countryCode: 'US',
    countryName: 'United States',
    region: 'North America',
    flagEmoji: '🇺🇸',
    currencyCode: 'USD',
    currencyName: 'US Dollar',
    baselineCost: 100,
    nightlyCost: 150,
  }

  it('renders country name and flag', () => {
    render(<CountryCard country={mockCountry} />)

    expect(screen.getByText('United States')).toBeInTheDocument()
    expect(screen.getByText('🇺🇸')).toBeInTheDocument()
  })

  it('calls onToggleBeenTo when button clicked', async () => {
    const user = userEvent.setup()
    const mockToggle = vi.fn()

    render(
      <CountryCard
        country={mockCountry}
        onToggleBeenTo={mockToggle}
      />
    )

    const button = screen.getByRole('button', { name: /been to/i })
    await user.click(button)

    expect(mockToggle).toHaveBeenCalledWith('US')
  })

  it('shows "Been To" badge when marked', () => {
    render(
      <CountryCard
        country={mockCountry}
        isBeenTo={true}
      />
    )

    expect(screen.getByText(/been to/i)).toBeInTheDocument()
  })
})
```

### 2. Hook Tests

**Test custom hooks in isolation.**

```typescript
// src/hooks/useCountries.test.ts
import { describe, it, expect } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useCountries } from './useCountries'

describe('useCountries', () => {
  it('loads countries from JSON', async () => {
    const { result } = renderHook(() => useCountries())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.countries.length).toBeGreaterThan(0)
    expect(result.current.countries[0]).toHaveProperty('countryCode')
  })

  it('filters countries by search term', async () => {
    const { result } = renderHook(() => useCountries())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    result.current.setSearch('japan')

    expect(result.current.filteredCountries).toHaveLength(1)
    expect(result.current.filteredCountries[0].countryName).toBe('Japan')
  })
})
```

### 3. Integration Tests

**Test complete user flows.**

```typescript
// src/features/country-tracking.test.tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from './App'

describe('Country Tracking Flow', () => {
  it('allows user to mark country and view in list', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Find and click a country
    const japanCard = screen.getByText('Japan')
    const beenToButton = screen.getByRole('button', { name: /been to/i })
    await user.click(beenToButton)

    // Navigate to Been To list
    const beenToLink = screen.getByRole('link', { name: /been to/i })
    await user.click(beenToLink)

    // Verify Japan appears in list
    expect(screen.getByText('Japan')).toBeInTheDocument()
  })
})
```

### 4. Firebase Mock Tests

**Mock Firebase for auth and Firestore tests.**

```typescript
// src/lib/firebase.test.ts
import { describe, it, expect, vi } from 'vitest'
import { signInWithPopup } from 'firebase/auth'

// Mock Firebase
vi.mock('firebase/auth', () => ({
  signInWithPopup: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  getAuth: vi.fn(),
}))

describe('Firebase Auth', () => {
  it('signs in user with Google', async () => {
    const mockUser = { uid: '123', email: 'test@example.com' }
    vi.mocked(signInWithPopup).mockResolvedValue({
      user: mockUser,
    } as any)

    const result = await signInWithGoogle()

    expect(result.user.email).toBe('test@example.com')
  })
})
```

---

## Running Tests

### Development Workflow

```bash
# Run tests in watch mode (runs on file save)
pnpm test

# Run tests once (CI mode)
pnpm test:run

# Run tests with UI
pnpm test:ui

# Run tests with coverage report
pnpm test:coverage
```

### File Naming Convention
```
src/
├── components/
│   └── CountryCard.tsx
│   └── CountryCard.test.tsx    # ✅ Co-located with component
├── hooks/
│   └── useCountries.ts
│   └── useCountries.test.ts    # ✅ Co-located with hook
└── test/
    └── setup.ts                 # Global test setup
```

---

## Coverage Goals

### MVP Targets (Realistic)
- **Overall:** 60%+ coverage
- **Critical paths:** 80%+ coverage
- **UI components:** 50%+ coverage (focus on behavior, not rendering)

### Check Coverage
```bash
pnpm test:coverage
```

Opens HTML report showing what's covered.

---

## Testing Checklist (Per Feature)

When building a feature, write tests for:

- [ ] Component renders without errors
- [ ] User interactions trigger expected callbacks
- [ ] State updates correctly
- [ ] Edge cases (empty states, errors)
- [ ] Accessibility (screen reader text, keyboard nav)

---

## Common Testing Scenarios

### Testing Async Data Loading
```typescript
it('shows loading state then data', async () => {
  render(<CountryGrid />)

  // Check loading state
  expect(screen.getByText(/loading/i)).toBeInTheDocument()

  // Wait for data to load
  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
  })

  // Check data is displayed
  expect(screen.getByText('United States')).toBeInTheDocument()
})
```

### Testing Forms
```typescript
it('submits search form', async () => {
  const user = userEvent.setup()
  const mockOnSearch = vi.fn()

  render(<SearchForm onSearch={mockOnSearch} />)

  const input = screen.getByRole('textbox')
  await user.type(input, 'Japan')
  await user.keyboard('{Enter}')

  expect(mockOnSearch).toHaveBeenCalledWith('Japan')
})
```

### Testing Context
```typescript
it('uses auth context', () => {
  const mockUser = { uid: '123', email: 'test@example.com' }

  render(
    <AuthContext.Provider value={{ user: mockUser }}>
      <UserProfile />
    </AuthContext.Provider>
  )

  expect(screen.getByText('test@example.com')).toBeInTheDocument()
})
```

---

## Best Practices

### ✅ Do
- Test behavior, not implementation
- Use `screen.getByRole()` for accessibility
- Test from the user's perspective
- Keep tests simple and readable
- Mock external dependencies (Firebase, APIs)

### ❌ Don't
- Test internal component state directly
- Test third-party libraries
- Write tests that depend on each other
- Over-mock (mock only what you need)
- Ignore failing tests

---

## Troubleshooting

### Test fails but app works
- Check if you're testing implementation details
- Verify test matches user behavior
- Use `screen.debug()` to see rendered output

### Can't find element
```typescript
// Use screen.debug() to see what's rendered
screen.debug()

// Check what queries are available
screen.logTestingPlaygroundURL()
```

### Async issues
```typescript
// Always await async operations
await waitFor(() => {
  expect(screen.getByText('Data')).toBeInTheDocument()
})

// Or use findBy (async version of getBy)
const element = await screen.findByText('Data')
```

---

## Resources

- [Vitest Docs](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Testing Best Practices](https://testingjavascript.com/)

---

## Next Steps

1. Complete project setup (Vite + dependencies)
2. Install testing dependencies (see Setup section)
3. Configure Vitest (add to vite.config.ts)
4. Write your first test alongside Feature 1
5. Make testing part of your workflow

**Remember:** Write tests as you build features, not all at once afterward.

---

Last updated: 2026-01-27
