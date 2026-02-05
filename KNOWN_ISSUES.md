# Known Issues

This document tracks known bugs, limitations, and technical debt in the Travel Motivation Planner.

## Status Legend
- 🔴 **Critical** - Blocks core functionality
- 🟡 **High** - Impacts user experience significantly
- 🟢 **Medium** - Minor impact, has workaround
- ⚪ **Low** - Cosmetic or edge case
- ✅ **Resolved** - Fixed in latest version

---

## Current Issues

### Data Quality

#### Country Dataset Accuracy
**Status:** Open
**Severity:** 🟡 High
**Description:** The current country dataset includes territories and regions that don't match the official UN country list. Some entries may be dependencies, territories, or disputed regions rather than sovereign nations.

**Impact:** Users may see countries/territories that aren't widely recognized as independent nations, leading to confusion about the official count and validity of the list.

**Examples:**
- Territories that are part of larger nations
- Disputed regions with unclear sovereignty
- Dependencies and overseas territories

**Planned Resolution:** Before v1.0 launch - Audit country dataset against ISO 3166-1 standard and UN member states list. Provide option to filter by:
- UN member states only (193 countries)
- UN member states + observers (195)
- All territories and dependencies

**Files:**
- `public/data/countries.json`
- `public/data/countries.geo.json`

**References:**
- ISO 3166-1 standard: https://www.iso.org/iso-3166-country-codes.html
- UN member states: https://www.un.org/en/about-us/member-states

---

### Map Functionality

#### Singapore Not Visible on Map
**Status:** Open
**Severity:** 🟡 High
**Description:** Singapore is not visible or clickable on the world map due to its small geographic size. The country exists in the GeoJSON data but is too small to see or interact with at default zoom levels.

**Impact:** Users cannot click Singapore on the map to mark it as visited. Must use the search/modal to add Singapore.

**Workaround:** Use the "Add country" button or search functionality to add Singapore to visited countries list.

**Potential Solutions:**
1. Add visual markers/pins for micro-states and city-states (Singapore, Monaco, Vatican City, etc.)
2. Implement a special zoom level or inset map for small nations
3. Add a "Small countries" category in the search modal with special handling
4. Use SVG markers or custom icons for countries below a certain pixel size

**Affected Countries:**
- Singapore
- Monaco
- Vatican City
- Liechtenstein
- San Marino
- Other micro-states

**Files:**
- `src/components/map/WorldMap.tsx`
- `public/data/countries.geo.json`

---

### UI/UX

#### Mobile Search Panel Position
**Status:** Open
**Severity:** 🟢 Medium
**Description:** On mobile devices, when the search input is focused, the search panel/list should pull up higher on the screen to improve visibility and prevent the keyboard from obscuring content.

**Impact:** Users may have difficulty seeing search results when the on-screen keyboard appears.

**Planned Resolution:** Implement CSS or JavaScript logic to detect input focus and adjust panel position/height when keyboard is visible.

**Files:**
- Component with search input (TBD)
- Modal or panel with search list (TBD)

---

#### ✅ Mobile Header Text Alignment
**Status:** Resolved (2026-01-30)
**Severity:** ⚪ Low
**Description:** "COUNTRY CRUSH" text in mobile header appeared too high compared to buttons due to SVG text positioning not accounting for stroke weight and bold font metrics.

**Resolution:** Adjusted mobile SVG `y` attribute from `50%` to `55%` to compensate for optical center being higher than geometric center with bold font and thick stroke.

**File:** `src/components/layout/Header.tsx:25`

---

## Resolved Issues

### ✅ Mobile Header Text Alignment (2026-01-30)
See details above.

---

## Technical Debt

### Storage Migration Path
**Priority:** Medium
**Description:** The storage abstraction layer is in place, but Firestore adapter is not yet implemented. Current MVP uses localStorage only.

**Impact:** Users cannot sync data across devices. Data is browser-specific.

**Planned Resolution:** v1.1 - Implement `FirestoreAdapter` and migration logic. See `STORAGE_STRATEGY.md` for full plan.

**Files:**
- `src/lib/storage/firestore.ts` (to be created)
- `src/lib/storage/index.ts` (to be updated)

---

### Country Data Completeness
**Priority:** Low
**Description:** Country dataset includes ~250 entries (including territories). Some metadata (like cost tiers) remains synthetic placeholders.

**Impact:** Cost tiers may be inaccurate and should not be used for real budgeting.

**Planned Resolution:** Before v1.0 launch - Replace synthetic travel costs with sourced data.

**Files:**
- `public/data/countries.json`
- `public/data/country-travel-costs.json`

---

### Placeholder Travel Costs
**Priority:** Medium
**Description:** Baseline and nightly costs are placeholders, and AI-generated travel tiers are synthetic estimates.

**Impact:** Cost estimates shown to users are not accurate for trip planning.

**Planned Resolution:** v2.0 - Integrate with Numbeo or BudgetYourTrip API for real cost data. See `ROADMAP.md` for details.

**Files:**
- `public/data/countries.json` (placeholder values)
- `public/data/country-travel-costs.json` (AI-generated synthetic tiers)
- `docs/TRAVEL_COSTS_AI_AUDIT.md` (delta review)
- Future: Cost API integration service

---

## Browser Compatibility

### Tested Browsers
- ✅ Chrome 120+ (Desktop & Mobile)
- ✅ Safari 17+ (Desktop & Mobile)
- ✅ Firefox 121+ (Desktop)
- ⚠️ Edge (Not yet tested)
- ⚠️ Opera (Not yet tested)

### Known Browser Issues
None currently documented.

---

## Performance

### Map Loading Time
**Status:** Monitoring
**Severity:** 🟢 Medium
**Description:** Initial map load with GeoJSON (13MB Natural Earth 10m data) may be slow on slower connections.

**Workaround:** Map data is cached after first load. Consider implementing loading skeleton/progress indicator.

**Potential Optimization:**
- Implement progressive loading
- Use smaller GeoJSON resolution for mobile
- Add service worker for offline caching

**Files:**
- `public/data/countries.geo.json` (13MB)
- `src/lib/map/loadGeoJSON.ts`

---

## Mobile-Specific Issues

None currently documented.

---

## Accessibility Issues

### Screen Reader Support
**Status:** Not yet tested
**Priority:** High (Pre-launch)
**Description:** Accessibility features (ARIA labels, keyboard navigation, screen reader compatibility) not yet comprehensively tested.

**Action Required:** Full accessibility audit before v1.0 launch.

**Standards Target:** WCAG 2.1 Level AA compliance

---

## Data & State Management

### localStorage Limits
**Status:** Known Limitation
**Severity:** ⚪ Low
**Description:** localStorage has a 5-10MB limit depending on browser. Large user datasets (e.g., extensive notes per country) could hit this limit.

**Workaround:** Current MVP data structure is minimal and unlikely to hit limits.

**Long-term Solution:** Migration to Firestore in v1.1 removes this limitation.

---

## Deployment & Infrastructure

None currently documented.

---

## Feature Gaps (Not Bugs)

These are planned features not yet implemented, tracked in `FEATURES.md` and `ROADMAP.md`:

- Authentication (v1.1)
- Firestore sync (v1.1)
- Social sharing (v1.1)
- Visit dates and notes (v1.2)
- Budget calculator (v2.0)
- AI suggestions (v2.0+)

See `FEATURES.md` for complete feature status.

---

## Reporting Issues

### For Development
1. Check if issue is already documented above
2. Add issue to appropriate section with severity and description
3. Update status as issue progresses
4. Mark as ✅ Resolved when fixed

### Issue Template
```markdown
#### [Issue Title]
**Status:** [Open/In Progress/Resolved]
**Severity:** [🔴 Critical / 🟡 High / 🟢 Medium / ⚪ Low]
**Description:** [What is the issue?]

**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]

**Expected Behavior:** [What should happen?]

**Actual Behavior:** [What actually happens?]

**Workaround:** [If any]

**Planned Resolution:** [How/when will this be fixed?]

**Files:**
- [Affected files]
```

---

## Version History

- **2026-01-30:** Initial KNOWN_ISSUES.md created
  - Documented resolved mobile header alignment issue
  - Added technical debt items (storage migration, placeholder costs)
  - Added performance monitoring notes

---

Last updated: 2026-01-30
