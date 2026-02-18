# Testing Guide: Auto-Detect Country Feature

## Quick Testing Steps

### 1. Fresh User Experience (First Visit)

```bash
# Open the app in incognito mode
# Chrome: Cmd+Shift+N
# Firefox: Cmd+Shift+P
# Safari: Cmd+Shift+N

# Navigate to: http://localhost:5173
```

**Expected behavior:**
1. Map loads immediately (no blocking)
2. Scroll down to "Personalized Recommendations" section
3. You should see:
   - Home location input shows your detected country (e.g., "Australia")
   - Badge below input: "Detected 🇦🇺 Australia ×"
   - "Culture" interest is pre-selected (blue background)
   - "12+ hours" flight duration is pre-selected
   - "Modest" budget tier is active
4. Recommendations should auto-generate (no button click needed)

### 2. Detection Badge Interaction

**Test the dismiss functionality:**

1. Click the "×" button in the detection badge
2. Expected results:
   - Home location input clears (becomes empty)
   - Input automatically gets focus (cursor appears)
   - Detection badge disappears
   - "Culture" and "12+ hours" remain selected

3. Refresh the page (F5 or Cmd+R)
4. Expected results:
   - Badge does NOT reappear (stays hidden)
   - Home location is empty (not auto-filled)

### 3. Budget Tier Persistence

1. Change budget tier (click "Budget" or "Bougie")
2. Refresh the page
3. Expected result:
   - Your selected budget tier is still active (not reset to "Modest")

### 4. Storage Inspection

**Check localStorage structure:**

1. Open DevTools (F12 or Cmd+Option+I)
2. Go to: Application → Storage → Local Storage → http://localhost:5173
3. Find key: `travel_planner_data`
4. Click to view value

Expected structure:
```json
{
  "beenTo": [],
  "wantToGo": [],
  "preferences": {
    "theme": "system",
    "displayCurrency": "USD",
    "recommendations": {
      "detectedCountry": "AU",
      "budgetTier": "modest",
      "detectionDismissed": false
    }
  },
  "lastUpdated": "2026-02-03T...",
  "version": "1.0"
}
```

### 5. Network Traffic Inspection

**Verify one-time API call:**

1. Open DevTools → Network tab
2. Clear network log (🚫 button)
3. Reload page in incognito
4. Filter by: "ip-api"
5. Expected:
   - ONE request to `http://ip-api.com/json/`
   - Status: 200 OK
   - Response includes: `countryCode`, `country`, `status: "success"`

6. Reload page again (same session)
7. Expected:
   - NO new request to ip-api.com (uses cached value)

### 6. API Failure Simulation

**Test fallback to Australia:**

1. Open DevTools → Network tab
2. Right-click → Block Request URL → Add pattern: `*ip-api.com*`
3. Open new incognito window
4. Navigate to http://localhost:5173
5. Scroll to recommendations
6. Expected:
   - Home location shows "Australia" (default fallback)
   - Badge shows "Detected 🇦🇺 Australia ×"
   - Console warning: "Country detection failed, defaulting to AU"

### 7. Manual Override

**Test manual country selection:**

1. Start with detected country (badge visible)
2. Click home location input
3. Clear and type a different country (e.g., "Japan")
4. Select from dropdown
5. Expected:
   - Input shows "Japan"
   - Badge still visible (shows original detection)
   - Recommendations regenerate for Japan

6. Dismiss badge (click ×)
7. Expected:
   - Badge disappears
   - Input clears to empty
   - Focus moves to input

### 8. Auto-Generation Flow

**Verify defaults trigger auto-generation:**

1. Clear localStorage: `localStorage.clear()`
2. Reload page
3. Scroll immediately to recommendations (within 1-2 seconds)
4. Wait for detection to complete (~1 second)
5. Expected:
   - Loading spinner appears briefly
   - "Generating your personalized recommendations..." message
   - Sample results disappear
   - Real recommendation cards appear (3-5 destinations)

## Console Commands for Testing

### Clear all data and start fresh
```javascript
localStorage.clear();
location.reload();
```

### Check current preferences
```javascript
const data = JSON.parse(localStorage.getItem('travel_planner_data'));
console.log('Detected Country:', data?.preferences?.recommendations?.detectedCountry);
console.log('Budget Tier:', data?.preferences?.recommendations?.budgetTier);
console.log('Badge Dismissed:', data?.preferences?.recommendations?.detectionDismissed);
```

### Manually trigger detection (developer testing)
```javascript
fetch('http://ip-api.com/json/')
  .then(r => r.json())
  .then(d => {
    console.log('Your location:', d.country, '(' + d.countryCode + ')');
    console.log('City:', d.city);
    console.log('Region:', d.regionName);
  });
```

### Check if detection would work for your location
```javascript
// List of available countries (subset of 42 with coordinates)
const available = ['US', 'GB', 'AU', 'JP', 'FR', 'DE', 'IT', 'ES', 'CA', 'NZ']; // truncated
fetch('http://ip-api.com/json/')
  .then(r => r.json())
  .then(d => {
    const code = d.countryCode;
    const isAvailable = available.includes(code);
    console.log('Detected:', code, isAvailable ? '✅ Available' : '❌ Not available (will use AU)');
  });
```

## Edge Cases to Test

### 1. VPN/Proxy Users
- Turn on VPN to different country
- Clear localStorage
- Reload page
- Verify detection uses VPN country
- Dismiss badge and manually select real country

### 2. Private Relay/Privacy Tools
- Enable iCloud Private Relay (if on macOS/iOS)
- Detection may return different country
- Should still work, just might not be accurate
- User can override

### 3. Rapid Reload Spam
- Clear localStorage
- Reload page 10 times rapidly
- Each reload should wait for previous detection
- Should not spam API (localStorage prevents re-detection)

### 4. Invalid Detected Country
If API returns a country not in our list:
- Should fallback to "AU"
- Check console: "Detected XX not available, defaulting to AU"

### 5. Browser Compatibility
Test in multiple browsers:
- Chrome/Edge (Chromium)
- Firefox
- Safari
- Mobile Safari (iOS)
- Mobile Chrome (Android)

## Troubleshooting

### Issue: Badge doesn't appear
**Check:**
1. Is this a fresh incognito session?
2. Is detection complete? (wait 1-2 seconds)
3. Check localStorage: `detectionDismissed` should be `false`
4. Check Network tab: Was API call successful?

### Issue: Wrong country detected
**Cause:** VPN, proxy, or privacy tool
**Solution:** User can click × and manually select country

### Issue: API request blocked
**Cause:** CORS, content blocker, or network restriction
**Check:**
1. Console errors
2. Network tab → Failed requests
3. Try: `curl http://ip-api.com/json/` in terminal

### Issue: Recommendations don't auto-generate
**Check:**
1. Are all defaults set? (home, interests, duration)
2. Is detection still loading?
3. Check console for errors
4. Try manually changing a preference to trigger generation

## Performance Metrics

**Expected timings:**
- API response: ~200-500ms
- Detection + storage: ~300-600ms total
- Auto-generation: ~1-2 seconds (includes image fetching)
- Total time to recommendations: ~2-3 seconds from page load

**Memory:**
- API response: ~5KB
- localStorage: ~2KB (base user data)
- No memory leaks (detection happens once)

## Success Criteria Checklist

- [ ] Detection works on first visit (fresh incognito)
- [ ] Badge appears with correct country flag + name
- [ ] Clicking × clears field, focuses input, hides badge
- [ ] Badge stays hidden after page refresh
- [ ] Budget tier persists across reloads
- [ ] No re-detection on subsequent visits (check Network tab)
- [ ] Defaults trigger auto-generation (culture, 12+ hours, modest)
- [ ] API failure defaults to Australia
- [ ] Manual country selection works alongside detection
- [ ] localStorage structure matches specification
- [ ] Console has no errors (warnings OK for fallback)
- [ ] Build succeeds (`pnpm build`)
- [ ] HMR works during development (`pnpm dev`)

---

**Last Updated**: 2026-02-03
**Feature**: Auto-Detect Country & Default Preferences
**Status**: Ready for Testing ✅
