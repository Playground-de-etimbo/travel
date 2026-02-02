# Unsplash API Setup (Optional)

## Current Status
✅ App works without API key - shows flag emoji on gradient backgrounds
🖼️ To add real photos, set up Unsplash API (takes 2 minutes)

## Setup Steps

1. Visit https://unsplash.com/developers
2. Click "Register as a developer" (or log in)
3. Create new application:
   - Name: "Travel Planner" (or any name)
   - Description: "Personal travel recommendations"
   - Accept terms
4. Copy your "Access Key"

5. Create `.env.local` in project root:
   ```bash
   echo 'VITE_UNSPLASH_ACCESS_KEY=your_access_key_here' > .env.local
   ```

6. Restart dev server:
   ```bash
   # Stop server (Ctrl+C)
   pnpm dev
   ```

## Verification

Open browser console while generating recommendations:
- ✅ Should see: Unsplash API requests in Network tab
- ❌ If you see: "Unsplash API key not configured" warning

## Free Tier Limits
- 50 requests/hour
- ~8 recommendation generations per hour (6 countries each)
- Perfect for development and personal use
