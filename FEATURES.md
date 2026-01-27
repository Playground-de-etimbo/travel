# Features & Status

## Status Legend
- ⚪ **Not Started** - Not yet begun
- 🔵 **In Progress** - Currently being built
- 🟢 **Completed** - Done and tested
- 🟡 **Blocked** - Waiting on something
- 🔴 **Postponed** - Moved to post-MVP

---

## MVP Features (v1.0)

### 1. Country Data & Display
| Feature | Status | Notes |
|---------|--------|-------|
| Static country JSON file | ⚪ | ~200 countries with metadata |
| Country card component | ⚪ | Flag, name, region, costs |
| Searchable country grid | ⚪ | Search by name, filter by region |
| Mobile-responsive card layout | ⚪ | Mobile-first design |
| Display placeholder costs | ⚪ | Baseline + nightly cost per country |
| Display local currency | ⚪ | Currency code and name |

**Ready to start:** Feature 1 - Create country data structure and card component

---

### 2. User State Management
| Feature | Status | Notes |
|---------|--------|-------|
| "Been to" toggle on cards | ⚪ | Visual badge when marked |
| "Want to go" toggle on cards | ⚪ | Visual badge when marked |
| Mutual exclusivity | ⚪ | Can't be both at once |
| Remove from list (toggle off) | ⚪ | Return to neutral state |
| Counter in header | ⚪ | "Been To: X \| Want To Go: Y" |
| Guest mode (localStorage) | ⚪ | Works without sign-in |

**Dependencies:** Country card component must be built first

---

### 3. List Views
| Feature | Status | Notes |
|---------|--------|-------|
| "Been to" list page | ⚪ | Shows all marked countries |
| "Want to go" list page | ⚪ | Shows all wishlist countries |
| Navigation between views | ⚪ | Directory / Been To / Want To Go |
| Empty states | ⚪ | Nice messages when lists are empty |
| Remove from list action | ⚪ | Quick toggle off |

**Dependencies:** Toggle functionality must work first

---

### 4. Authentication
| Feature | Status | Notes |
|---------|--------|-------|
| Firebase project setup | ⚪ | Create Firebase project |
| Google OAuth integration | ⚪ | Google sign-in button |
| Protected routes | ⚪ | Redirect logic |
| Sync localStorage to Firestore | ⚪ | On first sign-in |
| Sign out functionality | ⚪ | Clear session |
| Auth state persistence | ⚪ | Stay signed in |

**Dependencies:** Guest mode should work first, then add auth

---

### 5. Data Persistence (Firestore)
| Feature | Status | Notes |
|---------|--------|-------|
| Firestore database setup | ⚪ | Create users collection |
| Save beenTo array | ⚪ | Real-time sync |
| Save wantToGo array | ⚪ | Real-time sync |
| Load user data on sign-in | ⚪ | Restore from Firestore |
| Optimistic updates | ⚪ | Update UI immediately |
| Error handling | ⚪ | Handle network failures |

**Dependencies:** Auth must be working

---

### 6. Deployment & Polish
| Feature | Status | Notes |
|---------|--------|-------|
| Firebase Hosting setup | ⚪ | Deploy command configured |
| Environment variables | ⚪ | Firebase config |
| Buy Me a Coffee button | ⚪ | Non-intrusive placement |
| Loading states | ⚪ | Skeletons, spinners |
| Basic error boundaries | ⚪ | Graceful error handling |
| Favicon and meta tags | ⚪ | Basic SEO |

**Dependencies:** Core features complete

---

## Post-MVP Features (v1.1+)

### Future Enhancements
| Feature | Priority | Estimated Effort | Notes |
|---------|----------|------------------|-------|
| Interactive map view | High | Medium | MapLibre GL + country fills |
| Apple OAuth | Medium | Small | Add Apple sign-in |
| Visit dates (year visited) | Medium | Small | Optional field for Been To |
| Notes per country | Medium | Small | Optional text field |
| Region/continent filtering | Medium | Small | Filter dropdown |
| Country detail modal | Medium | Small | More info on click |
| Budget calculator | Low | Medium | Trip length × nightly cost |
| Planned trips list | Low | Medium | Separate from Want To Go |
| Export visited map as image | Low | Large | Map art for printing |
| Dark mode | Low | Small | Theme toggle |
| Multi-language support | Low | Large | i18n implementation |

---

## Feature Development Order (Recommended)

### Phase 1: Core Display (Week 1)
1. Project setup (Vite + React + TypeScript + Tailwind)
2. Country data JSON file
3. Country card component
4. Grid layout with search

### Phase 2: State Management (Week 1-2)
5. Toggle functionality (Been To / Want To Go)
6. localStorage for guest mode
7. Header counter
8. List view pages

### Phase 3: Authentication (Week 2)
9. Firebase project setup
10. Google OAuth integration
11. Sync localStorage → Firestore

### Phase 4: Persistence (Week 2-3)
12. Firestore save/load
13. Real-time sync
14. Error handling

### Phase 5: Polish & Deploy (Week 3)
15. Loading states and UX polish
16. Buy Me a Coffee integration
17. Firebase Hosting deployment
18. Testing and bug fixes

---

## Success Metrics (to track post-launch)

### MVP Goals
- [ ] 50+ users mark at least 5 "Been to" countries
- [ ] 50+ users add at least 3 "Want to go" countries
- [ ] 20% 4-week retention rate

### Technical Goals
- [ ] Page load under 2 seconds
- [ ] Mobile responsive on all screen sizes
- [ ] Zero Firebase costs for first 3 months
- [ ] 95%+ uptime

---

## Current Focus
**Next up:** Feature 1 - Country data structure and card component

**Blocked by:** None - ready to start

**Questions:**
- None at this time

---

Last updated: 2026-01-27
