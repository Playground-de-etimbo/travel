# Unsplash API Setup Guide

## Quick Start (Optional)

The recommendations feature works without an Unsplash API key - it will fall back to displaying flag emojis on colorful gradient backgrounds. However, for the best experience with real country photos, set up the Unsplash API:

## Step 1: Get Your API Key

1. Visit https://unsplash.com/developers
2. Click "Register as a developer" (or log in if you have an account)
3. Create a new application:
   - Name: "Travel Motivation Planner" (or anything you like)
   - Description: "Personal travel planning app"
   - Accept the terms
4. Copy your "Access Key" from the application page

## Step 2: Add to Your Project

Create a `.env.local` file in the project root:

```bash
# From the project directory
echo 'VITE_UNSPLASH_ACCESS_KEY=your_actual_access_key_here' > .env.local
```

Or manually create `.env.local` and add:

```
VITE_UNSPLASH_ACCESS_KEY=your_actual_access_key_here
```

## Step 3: Restart Dev Server

If the dev server is running, restart it to load the new environment variable:

```bash
# Stop the server (Ctrl+C)
# Then restart
pnpm dev
```

## Free Tier Limits

- **50 requests per hour**
- For the recommendations feature, this means you can generate recommendations ~8 times per hour (assuming 6 countries per generation)
- Plenty for development and personal use!

## Testing Without API Key

The feature works perfectly without the key:
1. Images will be replaced with large flag emojis on gradient backgrounds
2. All other functionality (cost calculation, filtering, etc.) works identically
3. You can always add the key later

## Troubleshooting

**"Failed to fetch image" in console:**
- Check that your API key is correct in `.env.local`
- Ensure the variable name is exactly `VITE_UNSPLASH_ACCESS_KEY`
- Restart the dev server after adding the key

**Rate limit exceeded:**
- Free tier: 50 requests/hour
- Wait an hour or upgrade your Unsplash plan
- Or continue using without images (flag emoji fallback)

**Images not loading:**
- Check browser console for errors
- Verify network connection
- Try regenerating recommendations (may be temporary API issue)

---

**Note:** The `.env.local` file is in `.gitignore` and will not be committed to version control. This keeps your API key private.
