# Known Issues

## Status Legend
- **Open** - Known but not yet addressed
- **Resolved** - Fixed

---

## Open Issues

### Micro-States Not Clickable on Map
**Severity:** Medium
**Description:** Singapore, Monaco, Vatican City, and other micro-states are too small to see or click on the world map at default zoom levels.

**Workaround:** Use the search panel to add these countries.

**Potential fixes:**
- Visual markers/pins for countries below a certain pixel size
- Inset maps for small nations
- Special zoom levels

**File:** `src/components/map/WorldMap.tsx`

---

### Mobile Search Panel Keyboard Overlap
**Severity:** Low
**Description:** On mobile, the on-screen keyboard can obscure search results when the input is focused.

**File:** `src/components/search/MobileSearchPanel.tsx`

---

## Technical Debt

### Storage Singleton Inconsistency
**Priority:** Low
**Description:** `useUserData.ts` creates its own `new LocalStorageAdapter()` instance instead of using the exported `storage` singleton from `@/lib/storage`. Works fine but violates the documented pattern. New code should use the singleton.

**Files:** `src/hooks/useUserData.ts`, `src/lib/storage/index.ts`

---

### Synthetic Travel Costs
**Priority:** Low
**Description:** Cost tiers in `country-travel-costs.json` are AI-generated synthetic estimates. Not suitable for real trip budgeting.

**Long-term:** Integrate with a real cost data API.

**Files:** `public/data/country-travel-costs.json`, `docs/TRAVEL_COSTS_AI_AUDIT.md`

---

### Country Dataset Accuracy
**Priority:** Low
**Description:** The dataset includes territories and dependencies alongside sovereign nations. Some entries may not match the official UN country list.

**File:** `public/data/countries.json`

---

## Resolved Issues

### Mobile Header Text Alignment (2026-01-30)
Fixed SVG `y` attribute from 50% to 55% to compensate for optical center offset with bold font and stroke.

---

## Reporting Issues

```markdown
### [Issue Title]
**Severity:** [High / Medium / Low]
**Description:** [What is the issue?]
**Workaround:** [If any]
**File:** [Affected files]
```

---

Last updated: 2026-02-18
