# Setup Guide

## Prerequisites

### Required Software
1. **Node.js** (v18 or higher)
   - Download: https://nodejs.org/
   - Verify: `node --version`

2. **pnpm** (comes with Node.js)
   - Verify: `pnpm --version`

3. **Git**
   - Download: https://git-scm.com/
   - Verify: `git --version`

4. **VS Code** (recommended)
   - Download: https://code.visualstudio.com/

### Recommended VS Code Extensions
- ESLint
- Prettier - Code formatter
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)

---

## Initial Project Setup

### 1. Clone Repository
```bash
git clone https://github.com/Playground-de-etimbo/travel.git
cd travel
```

### 2. Install Dependencies
```bash
pnpm install
```

This will install:
- React 18+
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Firebase SDK
- shadcn/ui dependencies

### 3. Environment Variables

Create `.env.local` in the root directory:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**Note:** These values will be provided after setting up Firebase (see below).

### 4. Start Development Server
```bash
pnpm run dev
```

The app will be available at `http://localhost:5173`

---

## Firebase Setup

### Step 1: Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Name it: `travel-planner` (or your preferred name)
4. Disable Google Analytics for MVP (can enable later)
5. Click "Create project"

### Step 2: Register Web App
1. In Firebase Console, click the web icon (`</>`)
2. App nickname: `travel-web`
3. Don't set up Firebase Hosting yet (we'll do it later)
4. Click "Register app"
5. Copy the `firebaseConfig` object
6. Paste values into `.env.local` (prefix with `VITE_`)

### Step 3: Enable Authentication
1. In Firebase Console, go to **Authentication**
2. Click "Get started"
3. Click "Google" under Sign-in providers
4. Toggle "Enable"
5. Select a support email
6. Click "Save"

### Step 4: Create Firestore Database
1. In Firebase Console, go to **Firestore Database**
2. Click "Create database"
3. Start in **Production mode** (we'll add rules later)
4. Choose a location (pick one closest to your users)
5. Click "Enable"

### Step 5: Set Firestore Security Rules
1. Go to **Firestore Database** → **Rules**
2. Replace with:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```
3. Click "Publish"

---

## Firebase Hosting Setup (for deployment)

### Step 1: Install Firebase CLI
```bash
pnpm install -g firebase-tools
```

### Step 2: Login to Firebase
```bash
firebase login
```

### Step 3: Initialize Firebase in Project
```bash
firebase init
```

Select:
- **Hosting**: Configure files for Firebase Hosting
- Use existing project: Select your project
- Public directory: `dist`
- Configure as SPA: **Yes**
- Set up automatic builds with GitHub: **No** (for now)

This creates:
- `firebase.json` - Hosting configuration
- `.firebaserc` - Project configuration

### Step 4: Build & Deploy
```bash
pnpm run build
firebase deploy
```

Your app will be live at: `https://your-project-id.web.app`

---

## Project Structure After Setup

```
travel/
├── node_modules/          # Installed dependencies (gitignored)
├── dist/                  # Production build (gitignored)
├── src/                   # Source code (to be created)
├── public/                # Static assets (to be created)
├── .env.local            # Environment variables (gitignored)
├── .env.example          # Example env file
├── package.json
├── vite.config.ts
├── tsconfig.json
└── ... (other config files)
```

---

## Verify Setup

### Check 1: Development Server
```bash
pnpm run dev
```
- Should start without errors
- Open `http://localhost:5173`
- Should see Vite + React default page (or our app once built)

### Check 2: TypeScript
```bash
npx tsc --noEmit
```
- Should show no errors

### Check 3: Build
```bash
pnpm run build
```
- Should create `dist/` folder without errors

### Check 4: Firebase Connection
Once we add Firebase initialization code:
```bash
# In browser console
// Should not see auth errors
```

---

## Troubleshooting

### Port 5173 already in use
```bash
# Kill the process using the port
lsof -ti:5173 | xargs kill -9

# Or specify a different port
pnpm run dev -- --port 3000
```

### Firebase config errors
- Check `.env.local` variable names start with `VITE_`
- Verify no quotes around values
- Restart dev server after changing env vars

### Module not found errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
pnpm install
```

### TypeScript errors
```bash
# Check TypeScript version
pnpm list typescript

# Should be 5.x or higher
```

---

## Next Steps

After setup is complete:
1. Read `DEVELOPMENT.md` for development workflow
2. Check `FEATURES.md` for current development status
3. Start building Feature 1 (country data and card component)

---

## Quick Reference

```bash
# Development
pnpm run dev              # Start dev server
pnpm run build           # Build for production
pnpm run preview         # Preview production build

# Firebase
firebase login          # Login to Firebase
firebase deploy         # Deploy to Firebase Hosting
firebase serve          # Test hosting locally

# Code Quality
pnpm run lint           # Run ESLint (if configured)
pnpm run format         # Run Prettier (if configured)
```

---

Last updated: 2026-01-27
