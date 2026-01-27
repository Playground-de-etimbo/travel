# Product Roadmap

## Vision
A web app that motivates travel by helping users track where they've been and where they want to go, with simple cost placeholders to make future trips feel tangible.

---

## Release Strategy

### MVP (v1.0) - Core Experience
**Goal:** Prove the concept and validate user interest
**Timeline:** 3-4 weeks
**Focus:** Essential tracking functionality, no frills

### v1.1 - Enhanced UX
**Goal:** Improve engagement with visual features
**Timeline:** 1-2 weeks after MVP launch
**Focus:** Map view, better filtering

### v2.0 - Planning Tools
**Goal:** Help users plan and budget trips
**Timeline:** 2-3 months after MVP
**Focus:** Trip planning, cost calculations, dates

### v3.0 - Social & Sharing
**Goal:** Community features and motivation
**Timeline:** 6+ months after MVP
**Focus:** Sharing, achievements, inspiration

---

## MVP (v1.0) - Launch Features

### Must-Have
✅ These features are required for launch.

#### World Map Hero
- [ ] Interactive world map at top of page
- [ ] Visited country highlighting with fill color
- [ ] Flag emoji overlays on visited countries
- [ ] Click country on map to toggle visited
- [ ] "Add country" button (opens multi-select)
- [ ] Mobile-responsive map with touch controls

#### Multi-Select Flow
- [ ] Modal dialog for bulk country selection
- [ ] Searchable country list in modal
- [ ] Multi-select checkboxes
- [ ] Running count ("X countries selected")
- [ ] Region filter within modal
- [ ] Save selections and update map
- [ ] Cancel without saving

#### Regional Stats
- [ ] Calculate visited per region/continent
- [ ] Summary stats on directory page ("Europe: 12/44")
- [ ] Detailed stats page with breakdowns
- [ ] Progress bars or visual indicators
- [ ] Percentage completion display
- [ ] Global total ("45/195 countries visited")

#### Country Data
- [ ] ~200 countries in static JSON
- [ ] GeoJSON data for map boundaries
- [ ] Country cards with flag, name, region, costs
- [ ] Search and filter functionality
- [ ] Mobile-responsive layout

#### User State (localStorage)
- [ ] Storage abstraction layer (Firebase-ready)
- [ ] "Been to" list persistence
- [ ] "Want to go" list persistence
- [ ] Auto-save on changes (debounced)
- [ ] Export/import functionality

#### List Views
- [ ] Dedicated "Been To" page
- [ ] Dedicated "Want To Go" page
- [ ] Dedicated "Stats" page
- [ ] Navigation between views
- [ ] Empty states
- [ ] Remove from list functionality

#### Costs & Currency
- [ ] Placeholder baseline cost per country
- [ ] Placeholder nightly cost per country
- [ ] Display local currency

#### Theme & Design
- [ ] "Midnight Map" color palette
- [ ] Light and dark mode support
- [ ] Tailwind + shadcn/ui integration
- [ ] Mobile-first responsive design

#### Deployment
- [ ] Firebase Hosting
- [ ] Custom domain (optional)
- [ ] Buy Me a Coffee button

---

## Post-MVP Features

### v1.1 - Authentication & Sync (High Priority)

#### Firebase Authentication
**Effort:** Small | **Impact:** High | **Timeline:** 1 week
- Google OAuth integration
- Firebase Auth setup
- Sign in / Sign out flows
- User profile page (basic)
- Protected routes (optional)

#### Data Migration
**Effort:** Medium | **Impact:** High | **Timeline:** 1 week
- Migrate localStorage to Firestore on first sign-in
- Real-time sync across devices
- Merge conflict resolution (if needed)
- Keep localStorage as fallback for offline

#### Social Sharing
**Effort:** Medium | **Impact:** Medium | **Timeline:** 1 week
- Generate map card image (visited countries)
- "Save to Photos" button
- Share to social media (Twitter, Instagram)
- Custom share text ("I've visited X countries!")

#### Better Filtering
**Effort:** Small | **Impact:** Medium | **Timeline:** 3 days
- Filter by region/continent
- Sort by cost
- Recently added
- Alphabetical

#### Country Detail Modal
**Effort:** Small | **Impact:** Medium | **Timeline:** 2 days
- Click card to see more info
- Wikipedia summary (optional)
- Photo (Unsplash API)
- Quick facts (capital, language)

---

### v1.2 - Enhanced Data (Medium Priority)

#### Visit Dates
**Effort:** Small | **Impact:** Medium | **Timeline:** 3 days
- Optional "Year visited" field for Been To
- Display chronologically
- "First trip" vs "Most recent trip" badges

#### Country Notes
**Effort:** Small | **Impact:** Low | **Timeline:** 2 days
- Optional text field per country
- "Favorite memory" or "Why I want to go"
- Character limit (500)

#### Apple OAuth
**Effort:** Small | **Impact:** Low | **Timeline:** 1 day
- Add Apple sign-in option
- Same flow as Google

---

### v2.0 - Planning Tools (Medium Priority)

#### Budget Calculator
**Effort:** Medium | **Impact:** High | **Timeline:** 1 week
- "Plan a trip" mode for wishlist countries
- Enter trip length (days)
- Calculate: (baseline + nightly × days)
- Total estimate
- Compare multiple destinations

#### Planned Trips List
**Effort:** Medium | **Impact:** Medium | **Timeline:** 1 week
- Separate from "Want to go"
- Add dates: "Japan - March 2027"
- Countdown timer to next trip
- Move to "Been to" after trip ends

#### Real Cost Data
**Effort:** Large | **Impact:** Medium | **Timeline:** 2 weeks
- Integrate Numbeo or BudgetYourTrip API
- Replace placeholders with real data
- Update monthly/quarterly
- Cost by travel style (budget/mid/luxury)

---

### v2.1 - Inspiration & Content (Low Priority)

#### Country Inspiration
**Effort:** Medium | **Impact:** Medium | **Timeline:** 1 week
- Top attractions (Wikipedia/Wikivoyage)
- Photo gallery (Unsplash)
- Best time to visit (seasonal data)
- Weather info (OpenWeather API)

#### Travel Safety Info
**Effort:** Small | **Impact:** Low | **Timeline:** 2 days
- Link to government travel advisories
- Basic safety rating (green/yellow/red)
- Required vaccinations (CDC API)

---

### v3.0 - Social Features (Low Priority)

#### Public Profiles (Optional)
**Effort:** Large | **Impact:** Medium | **Timeline:** 2 weeks
- Opt-in public profile
- Share your map
- "Travel score" (countries visited)
- Follow other travelers

#### Achievements
**Effort:** Small | **Impact:** Low | **Timeline:** 3 days
- Badges: "Continent Collector", "Island Hopper"
- Milestones: 10 countries, 25 countries, 50 countries
- Gamification elements

#### Travel Groups
**Effort:** Large | **Impact:** Low | **Timeline:** 3+ weeks
- Create groups with friends
- See where everyone has been
- Plan group trips
- Chat/comments

---

### v3.1 - Export & Art (Low Priority)

#### Map Art Export
**Effort:** Large | **Impact:** Low | **Timeline:** 2 weeks
- Generate printable map of visited countries
- Customization (colors, style)
- High-res PNG/PDF download
- Integration with print-on-demand (optional)

#### Stats & Insights
**Effort:** Medium | **Impact:** Low | **Timeline:** 1 week
- Charts: Countries per year, per continent
- Total cost of travel (estimated)
- "You've been to X% of the world"
- Favorite region, most visited continent

---

### Far Future Ideas (Backlog)

#### E-ink Display Integration
**Effort:** Large | **Impact:** Very Low
- API feed for e-ink devices
- Show next trip countdown
- Daily country fact

#### Packing Lists
**Effort:** Medium | **Impact:** Low
- Auto-generate based on destination
- Weather-aware suggestions
- Reusable templates

#### Itinerary Builder
**Effort:** Very Large | **Impact:** Medium
- Day-by-day planning
- Activity suggestions
- Time zone helpers
- Out of scope for now (use TripIt, etc.)

#### Bookings & Payments
**Effort:** Enormous | **Impact:** High (but complex)
- Flight/hotel search
- Booking integration
- Payment processing
- **Note:** Not planned - too complex, better done by existing services

---

## Feature Decision Framework

### How to Prioritize
When deciding what to build next, consider:

1. **User Impact** - How many users want this?
2. **Effort** - How long to build?
3. **ROI** - Impact ÷ Effort
4. **Strategic** - Does it support core value prop?
5. **Dependencies** - What must be built first?

### Example
| Feature | Impact | Effort | ROI | Priority |
|---------|--------|--------|-----|----------|
| Map view | High | Medium | 3/5 | High |
| Notes | Low | Small | 3/5 | Low |
| Budget calc | High | Medium | 3/5 | High |
| Social | Medium | Large | 1/5 | Low |

---

## Success Metrics by Version

### MVP (v1.0)
- 100+ sign-ups in first month
- 50+ users mark 5+ "Been to" countries
- 50+ users add 3+ "Want to go" countries
- 20% 4-week retention

### v1.1
- 30% of users engage with map view
- 10% increase in retention
- Avg session time increases by 2 minutes

### v2.0
- 20% of users create a planned trip
- 5% conversion to Buy Me a Coffee
- User referrals start happening organically

---

## Out of Scope (Forever)

These are explicitly **not** part of the vision:

- ❌ Booking flights/hotels
- ❌ Payment processing (beyond donations)
- ❌ Full itinerary management
- ❌ Travel blogs/reviews (use TripAdvisor)
- ❌ Live chat with other travelers
- ❌ Cryptocurrency integration
- ❌ NFTs or blockchain features

---

## Decision Log

### Why start with static JSON instead of API?
- Faster to build
- No external dependencies
- Instant loading
- Can migrate later if needed
- Country data rarely changes

### Why guest mode before auth?
- Lower barrier to entry
- Let users try before committing
- Still get value without account
- Conversion funnel: try → love it → sign in

### Why Google-only auth initially?
- Covers ~80% of users
- Simpler setup
- Apple auth requires paid developer account
- Can add Apple in v1.2

### Why Firebase over custom backend?
- Zero backend code
- Free tier covers MVP
- Scales automatically
- Faster to market
- Can migrate if needed

---

Last updated: 2026-01-27
