# Features & Status

## Status Legend
- ⚪ **Not Started** - Not yet begun
- 🔵 **In Progress** - Currently being built
- 🟢 **Completed** - Done and tested
- 🟡 **Blocked** - Waiting on something
- 🔴 **Postponed** - Moved to post-MVP

---

## MVP Features (v1.0)

### 1. World Map Hero
| Feature | Status | Notes |
|---------|--------|-------|
| Interactive world map component | 🟢 | react-simple-maps with pan/zoom |
| Visited country highlighting | 🟢 | Teal fill for visited countries |
| Flag overlay on visited countries | ⚪ | Show flag emojis on map |
| Click country to toggle visited | 🟢 | Single click toggles add/remove |
| "Add country" button | 🟢 | Opens modal with search/browse |
| Mobile-responsive map | 🟢 | Touch-friendly, proper zoom |

**Status:** Core map interactions complete. Click-to-toggle bypasses ZoomableGroup with global click handler.

---

### 2. Multi-Select Country Flow
| Feature | Status | Notes |
|---------|--------|-------|
| Modal dialog component | ⚪ | Opens on "Add country" click |
| Searchable country list | ⚪ | Filter by name |
| Multi-select checkboxes | ⚪ | Bulk selection |
| Running count display | ⚪ | "X countries selected" |
| Region filter in modal | ⚪ | Filter by continent |
| Save and apply selections | ⚪ | Update map and stats |
| Cancel without saving | ⚪ | Close modal, discard changes |

**Dependencies:** Country data structure, map component

---

### 3. Country Data & Display
| Feature | Status | Notes |
|---------|--------|-------|
| Static country JSON file | 🟢 | 20 countries for MVP testing |
| Country interface (TypeScript) | 🟢 | Type definitions complete |
| Country card component | ⚪ | Flag, name, region, costs |
| Searchable country grid | ⚪ | Search by name, filter by region |
| Mobile-responsive layout | ⚪ | Mobile-first design |
| Display placeholder costs | ⚪ | Baseline + nightly cost |
| Display local currency | ⚪ | Currency code and name |

**Ready to start:** Now - data structure complete

---

### 4. Regional Completion Stats
| Feature | Status | Notes |
|---------|--------|-------|
| Calculate visited per region | ⚪ | Group countries by continent |
| Summary stats on directory | ⚪ | "Europe: 12/44" above grid |
| Detailed stats section | ⚪ | Full breakdown on single page |
| Visual progress indicators | ⚪ | Progress bars or donuts |
| Percentage completion | ⚪ | "27% of Europe visited" |
| Total global completion | ⚪ | "45/195 countries" |
| **Comparative travel stats** | ⚪ | "You've traveled more than 95% of people" |
| **Global average comparison** | ⚪ | "Most people visit 10 countries - you've visited 5x that!" |
| **Percentile ranking** | ⚪ | Show user's travel percentile |
| **Motivational insights** | ⚪ | Context-aware messages about travel habits |

**Dependencies:** Country data with region field, user state, global travel statistics data

**Data Sources for Comparative Stats:**
- UN World Tourism Organization (UNWTO) - average countries visited per lifetime (~10)
- World Bank travel data - international trips per capita
- Pew Research Center - travel pattern studies
- Academic research on global travel behavior

**Metrics to Display:**
- Lifetime average: "Most people visit 10 countries in their lifetime"
- Multiplier: "You've visited 5x more than average!"
- Percentile: "You've traveled more than 95% of people"
- Continent diversity: "You've visited 5/7 continents"
- Rarity achievements: "Only 2% of people have visited all 7 continents"

---

### 5. User State Management (localStorage)
| Feature | Status | Notes |
|---------|--------|-------|
| Storage abstraction layer | 🟢 | localStorage + Firestore stub complete |
| Save "Been to" list | ⚪ | Persist to localStorage |
| Save "Want to go" list | ⚪ | Persist to localStorage |
| Load state on app start | ⚪ | Restore from storage |
| Automatic save on changes | ⚪ | Debounced updates |
| Export/import functionality | 🟢 | JSON export/import implemented |

**Dependencies:** None - ready for integration

---

### 6. List Views (Single-Page Sections)
| Feature | Status | Notes |
|---------|--------|-------|
| "Been to" section | ⚪ | Grid of visited countries on main page |
| "Want to go" section | ⚪ | Grid of wishlist countries on main page |
| Anchor link navigation | ⚪ | Smooth scroll to Map / Directory / Been To / Want To Go / Stats |
| Single-page layout | ⚪ | All sections on one scrollable page |
| Empty states | ⚪ | Nice messages when lists empty |
| Remove from list action | ⚪ | Toggle off countries |
| Sort options | ⚪ | Alphabetical, recently added |

**Dependencies:** Country cards, user state, anchor link navigation

---

### 7. Map Integration
| Feature | Status | Notes |
|---------|--------|-------|
| MapLibre GL setup | 🟢 | v5.16.0 installed |
| Country GeoJSON data | 🟢 | Natural Earth 10m data (13MB) |
| Map styling | ⚪ | "Midnight Map" theme colors |
| Zoom and pan controls | ⚪ | Touch and mouse support |
| Country boundaries | 🟢 | GeoJSON boundaries loaded |
| Hover effects | ⚪ | Highlight on hover |

**Dependencies:** Ready to implement map component

---

### 8. Color Theme
| Feature | Status | Notes |
|---------|--------|-------|
| "Midnight Map" palette | 🟢 | Premium blue theme implemented |
| Light mode colors | 🟢 | HSL CSS variables configured |
| Dark mode colors | 🟢 | Dark theme support via @media |
| Tailwind config | 🟢 | Tailwind v4 @theme directive |
| shadcn/ui theming | 🟢 | Components use theme colors |

**Dependencies:** Complete - theme fully integrated

---

### 9. Core UI Components
| Feature | Status | Notes |
|---------|--------|-------|
| Header with anchor links | 🔵 | Convert to smooth scroll navigation |
| Counter badge | ⚪ | "Been To: X \| Want To Go: Y" |
| Search bar component | ⚪ | Reusable search input |
| Modal component | 🟢 | shadcn/ui dialog installed |
| Button variants | 🟢 | shadcn/ui button installed |
| Badge component | 🟢 | shadcn/ui badge installed |
| Section dividers | ⚪ | Visual separators between page sections |

**Dependencies:** shadcn/ui setup complete

**Note:** Navigation changed from React Router pages to single-page with anchor links

---

### 10. Deployment & Polish
| Feature | Status | Notes |
|---------|--------|-------|
| Firebase Hosting setup | ⚪ | Deploy command configured |
| Environment variables | ⚪ | Config management |
| Buy Me a Coffee button | ⚪ | Non-intrusive placement |
| Loading states | ⚪ | Skeletons, spinners |
| Error boundaries | ⚪ | Graceful error handling |
| Favicon and meta tags | ⚪ | Basic SEO |
| Mobile app manifest | ⚪ | PWA support |

**Dependencies:** Core features complete

---

## Post-MVP Features (v1.1+)

### Authentication (v1.1 - High Priority)
| Feature | Priority | Effort | Notes |
|---------|----------|--------|-------|
| Firebase Authentication setup | High | Small | Enable auth service |
| Google OAuth | High | Small | Primary sign-in method |
| Migrate localStorage to Firestore | High | Medium | One-time sync on first sign-in |
| Protected routes | Medium | Small | Redirect logic |
| User profile page | Medium | Small | Basic account info |
| Sign out functionality | High | Small | Clear session |

---

### Social Sharing (v1.1 - Medium Priority)
| Feature | Priority | Effort | Notes |
|---------|----------|--------|-------|
| Generate map card image | Medium | Medium | Snapshot of visited countries |
| "Save to Photos" button | Medium | Small | Download PNG |
| Share to social media | Medium | Medium | Twitter, Instagram ready |
| Custom share text | Low | Small | "I've visited X countries!" |

---

### Enhanced Features (v1.2+)
| Feature | Priority | Effort | Notes |
|---------|----------|--------|-------|
| Apple OAuth | Medium | Small | Additional sign-in option |
| Visit dates (year visited) | Medium | Small | Optional field for Been To |
| Notes per country | Medium | Small | Optional text field |
| Country detail modal | Medium | Small | More info on click |
| Budget calculator | Low | Medium | Trip length × nightly cost |
| Planned trips list | Low | Medium | Separate from Want To Go |

---

### AI Features (v2.0+)
| Feature | Priority | Effort | Notes |
|---------|----------|--------|-------|
| AI destination suggestions | Low | Large | Suggest where to go next |
| Auto-update wishlist | Low | Medium | Add AI suggestions to Want To Go |
| Usage limits | Low | Small | X suggestions per user |
| Anonymous user limit | Low | Small | 1 suggestion without auth |

---

## Feature Development Order (Revised)

### Phase 1: Foundation (Week 1) ✅ COMPLETED
1. ✅ Project setup (Vite + React + TypeScript + Tailwind)
2. ✅ Color theme implementation ("Midnight Map")
3. ✅ **Storage abstraction layer** (critical for data model)
4. ✅ Country data JSON file with GeoJSON
5. ✅ Country TypeScript interfaces

### Phase 2: Core Data & Display (Week 1-2)
6. Single-page layout structure with sections
7. Convert navigation to anchor links (smooth scroll)
8. Country card component
9. Grid layout with search
10. User state management (localStorage with abstraction)
11. Basic list sections (Been To / Want To Go on same page)

### Phase 3: Map Integration (Week 2)
10. MapLibre GL setup
11. Map component with country boundaries
12. Visited country highlighting
13. Click-to-toggle functionality
14. Flag overlays on visited countries

### Phase 4: Multi-Select & Stats (Week 2-3)
15. Modal component
16. Multi-select country flow
17. Regional completion calculations
18. Stats summary on page
19. **Comparative travel stats** (global averages, percentile ranking)
20. Motivational insights ("You've visited 5x more than average!")
21. Detailed stats section with all breakdowns

### Phase 5: Polish & Deploy (Week 3)
22. Smooth scroll navigation polish
23. Section transitions and visual separators
24. Loading states and UX polish
25. Buy Me a Coffee integration
26. Firebase Hosting deployment
27. Testing and bug fixes

---

## Success Metrics (MVP)

### User Engagement
- [ ] 100+ users add at least 5 "Been to" countries
- [ ] 80+ users use multi-select to bulk-add countries
- [ ] 50+ users add at least 3 "Want to go" countries
- [ ] 40% of users interact with the map (click countries)

### Technical Goals
- [ ] Page load under 2 seconds (including map)
- [ ] Map renders in under 1 second
- [ ] Mobile responsive on all screen sizes
- [ ] Works offline with localStorage
- [ ] 95%+ uptime

### Post-Auth (v1.1)
- [ ] 20% 4-week retention rate
- [ ] 60% of localStorage users migrate to auth

---

## Current Focus

**Next up:** Phase 2 - Single-page layout and country card component

**Completed:** ✅ Phase 1 Foundation - All setup complete

**Ready to build:**
- Single-page layout structure with sections
- Convert React Router to anchor link navigation
- Country card component
- Grid layout with search
- User state hooks (useCountries, useUserData)
- Section-based list views (all on one page)

**Major Architecture Change:**
- 🔄 **Single-page design:** Changed from multi-page routes to one scrollable page with anchor links
- All content sections (Map, Directory, Been To, Want To Go, Stats) on same page
- Navigation uses smooth scroll instead of route changes

**Technical Decisions Made:**
- ✅ GeoJSON source: Natural Earth 10m resolution (13MB)
- ✅ Map tile provider: OpenStreetMap (free, no API keys)
- ✅ Map library: MapLibre GL JS v5.16.0
- ✅ Package manager: pnpm
- ✅ Tailwind CSS: v4 with @theme directive
- ✅ Layout: Single-page with anchor link navigation

---

Last updated: 2026-01-27 (updated for new MVP scope)
