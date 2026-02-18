# Product Roadmap

## Vision
A web app that motivates travel by helping users track where they've been and where they want to go, with personalized recommendations and shareable postcards.

---

## v1.0 — Core Experience (Complete)

Everything below is shipped and deployed on Vercel.

### Map & Selection
- [x] Interactive world map with click-to-toggle
- [x] Visited country highlighting with teal theme
- [x] Pan-to-country animation
- [x] Touch controls for mobile
- [x] Sound effects on add/remove

### Search
- [x] Desktop sticky search panel with autocomplete
- [x] Mobile bottom sheet with scroll expansion
- [x] Fuzzy search with Fuse.js
- [x] Country aliases ("UK", "Holland", etc.)
- [x] Region-grouped results

### Recommendations
- [x] Personalized destination suggestions
- [x] Interest-based filtering (weather, relaxation, culture, action)
- [x] Budget tier comparison (budget/modest/bougie)
- [x] Flight duration filtering
- [x] Unsplash photos with attribution
- [x] IP-based home country auto-detection
- [x] Auto-generation on preference change

### Postcard & Sharing
- [x] Shareable postcard with front/back
- [x] Country stamps on postcard back
- [x] Share via URL with encoded data
- [x] Shared postcard viewing experience
- [x] "Add to Photos" mobile share sheet
- [x] "Start your own journey" modal for recipients

### Design & UX
- [x] Light/dark mode with celestial animations
- [x] Floating pill navigation
- [x] "Midnight Map" color theme
- [x] Mobile-first responsive design
- [x] Portfolio footer

### Technical
- [x] localStorage persistence via StorageAdapter
- [x] Code-split bundle with lazy loading
- [x] Vercel Analytics + Speed Insights
- [x] Unit tests (Vitest) + E2E tests (Playwright)
- [x] HTTPS dev server via mkcert

---

## v2.0 — Content Sections (Next)

### Country Directory
- [ ] Country cards with photos, descriptions, key facts
- [ ] Filter by region/continent
- [ ] Sort by cost, alphabetical

### Want To Go
- [ ] Travel wishlist management
- [ ] Move between beenTo and wantToGo

### Travel Stats
- [ ] Comparative stats ("You've traveled more than X% of people")
- [ ] Regional completion tracking
- [ ] Progress visualizations

---

## v3.0 — Planning & Social (Future)

### Authentication & Sync
- [ ] User accounts (Google OAuth)
- [ ] Firestore sync (StorageAdapter already abstracted)
- [ ] Cross-device data sync

### Enhanced Data
- [ ] Visit dates and notes per country
- [ ] Real cost data (API integration)
- [ ] Country detail modals with Wikipedia/photos

### Social Features
- [ ] Public travel profiles
- [ ] Travel achievements/badges
- [ ] Group travel tracking

---

## Out of Scope

- Booking flights/hotels
- Payment processing
- Full itinerary management
- Travel blogs/reviews
- NFTs/blockchain

---

## Decision Log

| Decision | Rationale |
|----------|-----------|
| Static JSON over API | Faster loading, no external dependency, country data rarely changes |
| Guest mode before auth | Lower barrier, let users try before committing |
| localStorage first | Zero backend cost for MVP, StorageAdapter enables future migration |
| Vercel over Firebase Hosting | Simpler setup, automatic deploys, free SSL |
| react-simple-maps over MapLibre | Lighter bundle, simpler API, sufficient for country-level interaction |

---

Last updated: 2026-02-18
