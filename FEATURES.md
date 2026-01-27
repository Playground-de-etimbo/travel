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
| Interactive world map component | ⚪ | MapLibre GL integration |
| Visited country highlighting | ⚪ | Fill/color visited countries |
| Flag overlay on visited countries | ⚪ | Show flag emojis on map |
| Click country to toggle visited | ⚪ | Direct map interaction |
| "Add country" button | ⚪ | Opens multi-select modal |
| Mobile-responsive map | ⚪ | Touch-friendly, proper zoom |

**Ready to start:** After data model is created

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
| Static country JSON file | ⚪ | ~200 countries with metadata |
| Country interface (TypeScript) | ⚪ | Type definitions |
| Country card component | ⚪ | Flag, name, region, costs |
| Searchable country grid | ⚪ | Search by name, filter by region |
| Mobile-responsive layout | ⚪ | Mobile-first design |
| Display placeholder costs | ⚪ | Baseline + nightly cost |
| Display local currency | ⚪ | Currency code and name |

**Ready to start:** Feature 1 - Create country data structure

---

### 4. Regional Completion Stats
| Feature | Status | Notes |
|---------|--------|-------|
| Calculate visited per region | ⚪ | Group countries by continent |
| Summary stats on directory | ⚪ | "Europe: 12/44" above grid |
| Detailed stats page | ⚪ | Full breakdown with progress bars |
| Visual progress indicators | ⚪ | Progress bars or donuts |
| Percentage completion | ⚪ | "27% of Europe visited" |
| Total global completion | ⚪ | "45/195 countries" |

**Dependencies:** Country data with region field, user state

---

### 5. User State Management (localStorage)
| Feature | Status | Notes |
|---------|--------|-------|
| Storage abstraction layer | ⚪ | Easy Firebase migration later |
| Save "Been to" list | ⚪ | Persist to localStorage |
| Save "Want to go" list | ⚪ | Persist to localStorage |
| Load state on app start | ⚪ | Restore from storage |
| Automatic save on changes | ⚪ | Debounced updates |
| Export/import functionality | ⚪ | JSON export for backup |

**Dependencies:** None - start early

---

### 6. List Views
| Feature | Status | Notes |
|---------|--------|-------|
| "Been to" list page | ⚪ | Grid of visited countries |
| "Want to go" list page | ⚪ | Grid of wishlist countries |
| Navigation between views | ⚪ | Directory / Been To / Want To Go / Stats |
| Empty states | ⚪ | Nice messages when lists empty |
| Remove from list action | ⚪ | Toggle off countries |
| Sort options | ⚪ | Alphabetical, recently added |

**Dependencies:** Country cards, user state

---

### 7. Map Integration
| Feature | Status | Notes |
|---------|--------|-------|
| MapLibre GL setup | ⚪ | Free, open-source map library |
| Country GeoJSON data | ⚪ | Polygons for all countries |
| Map styling | ⚪ | "Midnight Map" theme colors |
| Zoom and pan controls | ⚪ | Touch and mouse support |
| Country boundaries | ⚪ | Clear borders |
| Hover effects | ⚪ | Highlight on hover |

**Dependencies:** MapLibre GL installed, GeoJSON data

---

### 8. Color Theme
| Feature | Status | Notes |
|---------|--------|-------|
| "Midnight Map" palette | ⚪ | Premium blue theme |
| Light mode colors | ⚪ | Apply HSL CSS variables |
| Dark mode colors | ⚪ | Dark theme support |
| Tailwind config | ⚪ | Integrate with Tailwind |
| shadcn/ui theming | ⚪ | Apply to components |

**Dependencies:** Tailwind setup complete

---

### 9. Core UI Components
| Feature | Status | Notes |
|---------|--------|-------|
| Header with navigation | ⚪ | Logo, nav links, counter |
| Counter badge | ⚪ | "Been To: X \| Want To Go: Y" |
| Search bar component | ⚪ | Reusable search input |
| Modal component | ⚪ | For multi-select flow |
| Button variants | ⚪ | Primary, secondary, ghost |
| Badge component | ⚪ | For "Been To" / "Want To Go" |

**Dependencies:** shadcn/ui setup

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

### Phase 1: Foundation (Week 1)
1. Project setup (Vite + React + TypeScript + Tailwind)
2. Color theme implementation ("Midnight Map")
3. **Storage abstraction layer** (critical for data model)
4. Country data JSON file with GeoJSON
5. Country TypeScript interfaces

### Phase 2: Core Data & Display (Week 1-2)
6. Country card component
7. Grid layout with search
8. User state management (localStorage with abstraction)
9. Basic list views (Been To / Want To Go)

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
18. Stats summary on directory
19. Detailed stats page

### Phase 5: Polish & Deploy (Week 3)
20. Navigation and routing
21. Loading states and UX polish
22. Buy Me a Coffee integration
23. Firebase Hosting deployment
24. Testing and bug fixes

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

**Next up:** Feature 1 - Storage abstraction layer + Country data structure

**Blocked by:** None - ready to start

**Questions:**
- GeoJSON source for country boundaries? (Natural Earth, OpenStreetMap)
- Map tile provider? (OpenStreetMap, Mapbox free tier)

---

Last updated: 2026-01-27 (updated for new MVP scope)
