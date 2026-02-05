# Getting Started

## Welcome!
This guide will help you go from documentation to working code. Follow these steps in order.

---

## Development Options

You can develop this project in two ways:

### Option A: Docker (Recommended for Consistency)
- ✅ No Node.js installation needed
- ✅ Consistent environment across machines
- ✅ Isolated dependencies
- See [DOCKER.md](DOCKER.md) for setup

### Option B: Local Development (Faster)
- ✅ Faster hot reload
- ✅ Direct access to tools
- ⚠️ Requires Node.js + ppnpm installed
- Follow instructions below

---

## Prerequisites Checklist

### For Docker (Option A)
- [ ] Docker Desktop installed (`docker --version`)
- [ ] Git installed (`git --version`)
- [ ] Code editor ready (VS Code recommended)
- [ ] (Optional - v1.1+) Firebase account if you want authentication/sync
- [ ] Read `DOCKER.md` for Docker-specific setup
- [ ] Read `PROJECT_BRIEF.md` (understand the vision)
- [ ] Read `TECH_STACK.md` (understand tech decisions)
- [ ] Reviewed `FEATURES.md` (know what we're building)

**Skip to:** [Docker Setup](#docker-quick-start)

### For Local Development (Option B)
- [ ] Node.js 18+ installed (`node --version`)
- [ ] pnpm installed (`pnpm --version` - install with `pnpm install -g pnpm`)
- [ ] Git installed (`git --version`)
- [ ] Code editor ready (VS Code recommended)
- [ ] (Optional - v1.1+) Firebase account if you want authentication/sync
- [ ] Read `PROJECT_BRIEF.md` (understand the vision)
- [ ] Read `TECH_STACK.md` (understand tech decisions)
- [ ] Reviewed `FEATURES.md` (know what we're building)

**Continue to:** [Step 1: Initialize the Project](#step-1-initialize-the-project)

---

## Docker Quick Start

**If you're using Docker**, follow these steps instead:

### 1. Environment Setup (Optional)

**For MVP:** No setup needed! Skip to step 2.

**For v1.1+ (Firebase):** Complete [Step 3: Set Up Firebase](#step-3-set-up-firebase) below to:
- Create Firebase project
- Enable Google Authentication
- Create Firestore database
- Create `.env.local` with Firebase config

### 2. Start Docker Container
```bash
docker-compose up
```

### 3. Access the App
Open http://localhost:5173

### 4. Start Building
Jump to [Step 6: Ready to Build Feature 1!](#step-6-ready-to-build-feature-1)

For detailed Docker commands and troubleshooting, see [DOCKER.md](DOCKER.md)

---

## Step 1: Initialize the Project

**Local development only** (skip if using Docker)

### 1.1 Create React + Vite Project
```bash
pnpm create vite@latest . -- --template react-ts
```

This creates:
- React 18 setup
- TypeScript configuration
- Vite dev server
- Basic project structure

### 1.2 Install Dependencies
```bash
pnpm install
```

### 1.3 Install Additional Packages

#### UI and Styling
```bash
pnpm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

#### Routing
```bash
pnpm install react-router-dom
```

#### Firebase
```bash
pnpm install firebase
```

#### shadcn/ui Setup
```bash
npx shadcn-ui@latest init
```

When prompted:
- Style: **Default**
- Base color: **Slate** (or your preference)
- CSS variables: **Yes**

This creates:
- `components.json` config
- `src/components/ui/` folder
- `src/lib/utils.ts`

---

## Step 2: Configure Tailwind CSS

### 2.1 Update `tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // shadcn/ui will populate this
    },
  },
  plugins: [],
}
```

### 2.2 Update `src/index.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Add any global styles here */
```

---

## Step 3: Deploy to Vercel (MVP)

The easiest way to deploy your MVP is with Vercel. It provides automatic deployments, free SSL, and requires zero configuration.

### 3.1 Install Vercel CLI
```bash
pnpm install -g vercel
```

### 3.2 Login and Deploy
```bash
vercel login
vercel --prod
```

Follow the prompts to set up your project. Your app will be live at `https://your-project-name.vercel.app`

### 3.3 Automatic Deployments (Optional)
Connect your Git repository in the Vercel dashboard for automatic deployments on every push.

### 3.4 Environment Variables (Optional)
Add your Unsplash API key in the Vercel dashboard under Settings → Environment Variables:
- Key: `VITE_UNSPLASH_ACCESS_KEY`
- Value: Your Unsplash access key

For complete deployment instructions, see `VERCEL_DEPLOYMENT.md`.

---

## Step 4: Set Up Firebase (v1.1+ - Optional)

**Skip this step for MVP development. Firebase is only needed for v1.1+ features (authentication and cross-device sync).**

### When You Need This
- Google/Apple sign-in support
- Multi-device data synchronization
- Real-time updates across devices

### 4.1 Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Project name: `travel-planner` (or your choice)
4. Disable Google Analytics (for now)
5. Click "Create project"

### 4.2 Register Web App
1. Click web icon (`</>`)
2. App nickname: `travel-web`
3. Don't set up Firebase Hosting yet
4. Copy the config object

### 4.3 Create Environment File
Create `.env.local`:
```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Create `.env.example` (for git):
```bash
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4.4 Enable Google Authentication
1. In Firebase Console → Authentication
2. Click "Get started"
3. Enable "Google" provider
4. Select support email
5. Save

### 4.5 Create Firestore Database
1. In Firebase Console → Firestore Database
2. Click "Create database"
3. Start in **Production mode**
4. Choose location (closest to users)
5. Click "Enable"

### 4.6 Set Firestore Rules
In Firestore → Rules:
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
Click "Publish"

---

## Step 5: Create Initial File Structure

### 5.1 Create Folders
```bash
mkdir -p src/components/ui
mkdir -p src/components/layout
mkdir -p src/components/country
mkdir -p src/components/auth
mkdir -p src/pages
mkdir -p src/hooks
mkdir -p src/context
mkdir -p src/lib
mkdir -p src/types
mkdir -p public/data
```

### 5.2 Update `.gitignore`
Add to `.gitignore`:
```
# Environment variables
.env.local

# Firebase
.firebase/
.firebaserc
firebase-debug.log

# Build
dist/
```

---

## Step 6: Verify Setup

### 6.1 Start Dev Server
```bash
pnpm dev
```

Should start on `http://localhost:5173`

### 6.2 Check for Errors
- No TypeScript errors
- No console errors
- Vite default page loads

### 6.3 Test Build
```bash
pnpm build
```

Should create `dist/` folder without errors.

---

## Step 7: Ready to Build Feature 1!

You're now ready to start building. The first feature is:

### Feature 1: Country Data & Card Component

**What to build:**
1. Create `public/data/countries.json` with country data
2. Create `public/data/country-travel-costs.json` with budget tier costs (optional)
2. Create TypeScript interface for Country
3. Create `CountryCard` component
4. Create `CountryGrid` component to display all cards
5. Add basic search functionality

**Files you'll create:**
- `public/data/countries.json` - Country data
- `public/data/country-travel-costs.json` - Local-currency travel cost tiers
- `src/types/country.ts` - TypeScript types
- `src/components/country/CountryCard.tsx` - Card component
- `src/components/country/CountryGrid.tsx` - Grid layout
- `src/components/country/CountrySearch.tsx` - Search bar
- `src/hooks/useCountries.ts` - Hook to load and filter countries
- `src/pages/DirectoryPage.tsx` - Main page

**Approach:**
1. Start with a small subset of countries (5-10) for testing
2. Build the card component with mock data
3. Add the full country list later
4. Style with Tailwind (mobile-first)
5. Test on different screen sizes

**shadcn/ui components you'll need:**
```bash
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add button
```

---

## Quick Reference

### Project Status
- 📚 Documentation: Complete
- 🏗️ Project setup: In progress
- 💻 Feature 1: Ready to start
- 🚀 Deployment: Not yet

### Key Documentation
- `PROJECT_BRIEF.md` - What we're building and why
- `TECH_STACK.md` - Technology decisions and rationale
- `FEATURES.md` - Feature list with status tracking
- `ARCHITECTURE.md` - Code structure and patterns
- `DEVELOPMENT.md` - Development workflow
- `ROADMAP.md` - MVP vs future features
- `SETUP.md` - Detailed setup instructions

### Commands You'll Use Often
```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm preview      # Preview production build
npx tsc --noEmit    # Check TypeScript errors
```

---

## Next Steps

1. Complete Step 1-5 above (project initialization)
2. Ask Claude to help you build Feature 1 (country data and cards)
3. Update `FEATURES.md` as you complete features
4. Refer to `DEVELOPMENT.md` for coding conventions
5. Check `ARCHITECTURE.md` when deciding where files go

---

## Need Help?

### Common Questions
- **Where should X file go?** → Check `ARCHITECTURE.md`
- **How do I name this component?** → Check `DEVELOPMENT.md`
- **What's the mobile-first approach?** → Check `TECH_STACK.md`
- **What feature should I build next?** → Check `FEATURES.md`

### Stuck?
- Read the relevant documentation file
- Check Firebase documentation
- Ask Claude for help with specific implementation

---

Good luck building! 🚀

Last updated: 2026-01-27
