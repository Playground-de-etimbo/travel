# Development Workflow

## Overview
This document outlines how to build features, follow conventions, and maintain code quality.

---

## Development Cycle

### 1. Pick a Feature
- Check `FEATURES.md` for status
- Pick next ⚪ Not Started feature
- Update status to 🔵 In Progress

### 2. Create Branch (optional for solo dev)
```bash
git checkout -b feature/country-card-component
```

### 3. Build the Feature
- Start dev server: `pnpm dev`
- Write code
- Test in browser
- Iterate

### 4. Update Documentation
- Mark feature as 🟢 Completed in `FEATURES.md`
- Add notes if needed

### 5. Commit Changes
```bash
git add .
git commit -m "feat: add country card component with toggle buttons"
git push
```

---

## Code Conventions

### File Naming
- **Components:** PascalCase - `CountryCard.tsx`
- **Hooks:** camelCase with `use` prefix - `useCountries.ts`
- **Utils:** camelCase - `formatCurrency.ts`
- **Types:** PascalCase - `Country.ts`

### Component Structure
```tsx
// Imports
import { useState } from 'react';
import type { Country } from '@/types';

// Interface for props
interface CountryCardProps {
  country: Country;
  onToggle: (code: string) => void;
}

// Component
export const CountryCard = ({ country, onToggle }: CountryCardProps) => {
  // Hooks
  const [isHovered, setIsHovered] = useState(false);

  // Event handlers
  const handleClick = () => {
    onToggle(country.countryCode);
  };

  // Render
  return (
    <div
      className="..."
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* JSX */}
    </div>
  );
};
```

### TypeScript Guidelines
```tsx
// ✅ Good: Explicit types for props and state
interface Props {
  count: number;
  onIncrement: () => void;
}

// ✅ Good: Type imports
import type { Country } from '@/types';

// ❌ Avoid: any
const data: any = ...;

// ✅ Use: unknown (if type is truly unknown)
const data: unknown = ...;
```

### Tailwind CSS Conventions
```tsx
// ✅ Good: Mobile-first responsive
<div className="px-4 sm:px-6 lg:px-8">

// ✅ Good: Logical grouping
<div className="
  flex items-center gap-2
  px-4 py-2
  bg-white hover:bg-gray-50
  border border-gray-200 rounded-lg
  transition-colors
">

// ❌ Avoid: Inline styles
<div style={{ padding: '16px' }}>
```

---

## Adding shadcn/ui Components

### Install Component
```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
```

### Use Component
```tsx
import { Button } from '@/components/ui/button';

export const MyComponent = () => {
  return <Button variant="outline">Click me</Button>;
};
```

### Available Components
Common ones you'll need:
- `button` - Buttons with variants
- `card` - Card container
- `input` - Text input
- `badge` - Badge/tag component
- `dialog` - Modal dialog
- `dropdown-menu` - Dropdown menu
- `toast` - Toast notifications

Full list: https://ui.shadcn.com/docs/components

---

## Working with Firebase

### Reading User Data
```tsx
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const userRef = doc(db, 'users', userId);
const userSnap = await getDoc(userRef);

if (userSnap.exists()) {
  const userData = userSnap.data();
  console.log(userData.beenTo);
}
```

### Writing User Data
```tsx
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

await setDoc(doc(db, 'users', userId), {
  beenTo: ['US', 'CA', 'MX'],
  wantToGo: ['JP', 'FR'],
  lastUpdated: new Date(),
});
```

### Real-time Listener
```tsx
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const unsubscribe = onSnapshot(doc(db, 'users', userId), (doc) => {
  const data = doc.data();
  setBeenTo(data.beenTo);
});

// Cleanup
return () => unsubscribe();
```

---

## Common Tasks

### Add a New Page
1. Create component in `src/pages/NewPage.tsx`
2. Add route in `src/App.tsx`:
   ```tsx
   <Route path="/new" element={<NewPage />} />
   ```
3. Add navigation link in `Header.tsx`

### Add a New Hook
1. Create file in `src/hooks/useMyHook.ts`
2. Export hook:
   ```tsx
   export const useMyHook = () => {
     const [state, setState] = useState();

     return { state, setState };
   };
   ```
3. Use in component:
   ```tsx
   const { state, setState } = useMyHook();
   ```

### Add a New Type
1. Create or edit file in `src/types/`
2. Export interface:
   ```tsx
   export interface Country {
     countryCode: string;
     countryName: string;
     // ...
   }
   ```
3. Re-export in `src/types/index.ts`

### Add Static Data
1. Place JSON file in `public/data/`
2. Fetch in component or hook:
   ```tsx
   const response = await fetch('/data/countries.json');
   const countries = await response.json();
   ```

---

## Testing Workflow (Post-MVP)

### Unit Tests
```bash
# Run tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage
```

### Example Test
```tsx
import { render, screen } from '@testing-library/react';
import { CountryCard } from './CountryCard';

test('renders country name', () => {
  const country = { countryName: 'Japan', ... };
  render(<CountryCard country={country} />);

  expect(screen.getByText('Japan')).toBeInTheDocument();
});
```

---

## Debugging Tips

### React DevTools
- Install browser extension
- Inspect component props and state
- Profile performance

### Firebase Emulator (optional)
```bash
# Use local Firestore for testing
firebase emulators:start
```

### Console Logging
```tsx
// Use in development only
console.log('Country:', country);
console.table(countries);

// Remove before commit
```

### TypeScript Errors
```bash
# Check all errors
npx tsc --noEmit

# Fix common issues
# - Missing imports
# - Wrong prop types
# - Undefined variables
```

---

## Git Workflow

### Commit Message Format
```
<type>: <description>

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructuring
- test: Adding tests
- chore: Maintenance

Examples:
feat: add country search filter
fix: correct toggle button state
docs: update setup instructions
style: format code with prettier
```

### Branch Naming (if using branches)
```
feature/country-card
fix/toggle-bug
docs/setup-guide
```

---

## Performance Best Practices

### Avoid Unnecessary Re-renders
```tsx
// ✅ Good: Memoize callbacks
const handleToggle = useCallback((code: string) => {
  toggleBeenTo(code);
}, [toggleBeenTo]);

// ✅ Good: Memoize expensive computations
const filteredCountries = useMemo(() => {
  return countries.filter(c => c.name.includes(search));
}, [countries, search]);
```

### Optimize Images
```tsx
// Use appropriate sizes
<img
  src="/flag.svg"
  alt="Flag"
  width={24}
  height={24}
  loading="lazy"
/>
```

### Code Splitting (Future)
```tsx
// Lazy load pages
const BeenToPage = lazy(() => import('./pages/BeenToPage'));

<Suspense fallback={<Loading />}>
  <BeenToPage />
</Suspense>
```

---

## Deployment Checklist

### Before Deploy
- [ ] Build succeeds: `pnpm build`
- [ ] No TypeScript errors: `npx tsc --noEmit`
- [ ] Test in production mode: `pnpm preview`
- [ ] Check environment variables are set
- [ ] Update `FEATURES.md` status
- [ ] Commit all changes

### Deploy
```bash
# Build
pnpm build

# Deploy to Firebase
firebase deploy

# Or deploy to Vercel (alternative)
vercel deploy --prod
```

### After Deploy
- [ ] Test on live URL
- [ ] Check Firebase usage in console
- [ ] Verify auth works
- [ ] Test on mobile device

---

## Common Issues & Solutions

### Issue: Component not re-rendering
**Solution:** Check if state is being mutated directly
```tsx
// ❌ Wrong: Direct mutation
beenTo.push('US');
setBeenTo(beenTo);

// ✅ Correct: New array
setBeenTo([...beenTo, 'US']);
```

### Issue: Firebase auth not persisting
**Solution:** Check Firebase auth persistence setting
```tsx
import { setPersistence, browserLocalPersistence } from 'firebase/auth';

await setPersistence(auth, browserLocalPersistence);
```

### Issue: Tailwind classes not working
**Solution:**
1. Check `tailwind.config.js` content paths
2. Restart dev server
3. Check for typos in class names

### Issue: Environment variables not loaded
**Solution:**
1. Prefix with `VITE_`
2. Restart dev server after changes
3. No quotes around values in `.env.local`

---

## Resources

### Documentation
- React: https://react.dev/
- Vite: https://vitejs.dev/
- TypeScript: https://www.typescriptlang.org/docs/
- Tailwind CSS: https://tailwindcss.com/docs
- shadcn/ui: https://ui.shadcn.com/
- Firebase: https://firebase.google.com/docs
- React Router: https://reactrouter.com/

### Tools
- TypeScript Playground: https://www.typescriptlang.org/play
- Tailwind Play: https://play.tailwindcss.com/
- Can I Use: https://caniuse.com/

---

Last updated: 2026-01-27
