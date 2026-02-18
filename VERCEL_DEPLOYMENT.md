# Vercel Deployment Guide

## Overview

This guide covers deploying the Travel Motivation Planner MVP to Vercel. Vercel provides zero-configuration deployments with automatic builds, free SSL certificates, and global edge network distribution.

**Why Vercel for MVP:**
- No Firebase account needed (simpler setup)
- Automatic deployments on git push
- Built-in preview deployments for PRs
- Free tier sufficient for MVP traffic
- Instant rollbacks
- Automatic HTTPS with custom domains

---

## Prerequisites

### Required
- **Git repository** - Your code must be in a Git repo (GitHub, GitLab, or Bitbucket)
- **Vercel account** - Free tier available at https://vercel.com/signup
- **Node.js 18+** - For local builds (optional but recommended)

### Verify Your Build Works Locally
```bash
pnpm install
pnpm build
pnpm preview
```

If the preview works at `http://localhost:4173`, you're ready to deploy.

---

## Method 1: Vercel CLI (Quick Deploy)

The fastest way to deploy for the first time.

### Step 1: Install Vercel CLI
```bash
pnpm install -g vercel
```

Verify installation:
```bash
vercel --version
```

### Step 2: Login to Vercel
```bash
vercel login
```

This will open your browser for authentication. Choose your login method:
- GitHub (recommended for automatic deployments)
- GitLab
- Bitbucket
- Email

### Step 3: Deploy from Project Root
```bash
cd /path/to/travel
vercel --prod
```

You'll be prompted with:

```
? Set up and deploy "~/travel"? [Y/n] y
? Which scope do you want to deploy to? Your Name
? Link to existing project? [y/N] n
? What's your project's name? travel-planner
? In which directory is your code located? ./
```

**Answer:**
- Set up and deploy: **Yes**
- Scope: Select your account
- Link to existing project: **No** (first deployment)
- Project name: `travel-planner` (or your choice)
- Directory: `./` (current directory)

Vercel will auto-detect:
- Framework: **Vite**
- Build Command: `pnpm run build`
- Output Directory: `dist`
- Install Command: `pnpm install`

### Step 4: Deployment Complete
```
✅ Production: https://travel-planner.vercel.app [copied to clipboard]
```

Your app is now live! The URL is copied to your clipboard.

### Step 5: Subsequent Deployments
For future deployments, just run:
```bash
vercel --prod
```

No prompts - instant deployment.

---

## Method 2: Git Integration (Recommended)

Automatic deployments on every push to your repository.

### Step 1: Push Code to Git
```bash
git init  # if not already a git repo
git add .
git commit -m "feat: initial commit"
git remote add origin https://github.com/yourusername/travel.git
git push -u origin main
```

### Step 2: Import Project in Vercel Dashboard

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Authorize Vercel to access your GitHub/GitLab/Bitbucket
4. Select your repository: `travel`
5. Configure project:

```
Project Name: travel-planner
Framework Preset: Vite
Root Directory: ./
Build Command: pnpm run build
Output Directory: dist
Install Command: pnpm install
```

6. Click "Deploy"

### Step 3: Automatic Deployments Enabled

Now every push to your repository triggers a deployment:

- **Push to `main` branch** → Production deployment at `https://travel-planner.vercel.app`
- **Push to other branches** → Preview deployment at `https://travel-planner-git-branch-name.vercel.app`
- **Open Pull Request** → Preview deployment with comment in PR

### Step 4: Monitor Deployments

View deployment status:
- https://vercel.com/your-username/travel-planner/deployments

Each deployment shows:
- Build logs
- Deployment URL
- Commit SHA
- Build duration

---

## Environment Variables

### For MVP (No Variables Needed!)

The MVP works perfectly without any environment variables. The app uses localStorage for data persistence.

### Optional: Unsplash API Key

If you want the travel recommendations feature:

#### Via Dashboard
1. Go to https://vercel.com/your-username/travel-planner
2. Navigate to **Settings** → **Environment Variables**
3. Add variable:
   - **Name:** `VITE_UNSPLASH_ACCESS_KEY`
   - **Value:** Your Unsplash access key
   - **Environments:** Check all (Production, Preview, Development)
4. Click **Save**
5. Redeploy to apply changes

#### Via CLI
```bash
vercel env add VITE_UNSPLASH_ACCESS_KEY
```

When prompted:
- Value: Paste your Unsplash access key
- Environments: Select all

Then redeploy:
```bash
vercel --prod
```

---

## Custom Domain Setup

### Step 1: Add Domain in Vercel

1. Go to project **Settings** → **Domains**
2. Enter your domain: `travelplanner.com`
3. Click **Add**

### Step 2: Configure DNS

Vercel will show you DNS records to add. Two options:

#### Option A: Nameservers (Recommended)
Point your domain's nameservers to Vercel:
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

This gives Vercel full DNS control and enables automatic SSL.

#### Option B: A/CNAME Records
Add these records at your DNS provider:

**For root domain (`travelplanner.com`):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Step 3: Wait for SSL Certificate

Vercel automatically provisions SSL certificates via Let's Encrypt. This usually takes 1-5 minutes.

Status indicators:
- ⏳ **Pending:** DNS propagating
- ✅ **Valid:** Domain active with HTTPS

### Step 4: Set Primary Domain

If you added multiple domains (e.g., `travelplanner.com` and `www.travelplanner.com`):

1. Go to **Domains** settings
2. Click the three dots next to your preferred domain
3. Select **Set as Primary**

All other domains will redirect to the primary.

---

## Configuration File (vercel.json)

### For MVP (No Config Needed!)

Vercel auto-detects Vite projects and configures everything correctly. You don't need a `vercel.json` file.

### Optional: Custom Configuration

Create `vercel.json` in project root for custom settings:

```json
{
  "buildCommand": "pnpm run build",
  "devCommand": "pnpm run dev",
  "installCommand": "pnpm install",
  "framework": "vite",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

**Rewrite rule:** Ensures SPA routing works (all paths serve `index.html`)
**Headers:** Security headers for production

---

## Deployment Checklist

Before deploying to production:

### Local Testing
- [ ] Run `pnpm build` without errors
- [ ] Run `pnpm preview` and test app locally
- [ ] Check browser console for errors
- [ ] Test on mobile viewport sizes
- [ ] Verify localStorage persistence works

### TypeScript & Linting
- [ ] Run `pnpm run lint` (if configured)
- [ ] Fix all TypeScript errors: `npx tsc --noEmit`

### Git & Version Control
- [ ] Commit all changes: `git status` should be clean
- [ ] Push to remote: `git push origin main`
- [ ] Tag release (optional): `git tag v1.0.0 && git push --tags`

### Vercel Configuration
- [ ] Build command is `pnpm run build`
- [ ] Output directory is `dist`
- [ ] Framework detected as Vite
- [ ] Environment variables added (if using Unsplash)

### Post-Deployment
- [ ] Visit production URL
- [ ] Test country selection on map
- [ ] Verify localStorage saves data
- [ ] Check responsive design on mobile
- [ ] Test search and filtering
- [ ] Verify all images load

---

## Monitoring & Analytics

### Vercel Analytics (Free)

Enable real user monitoring:

1. Go to **Analytics** tab in project dashboard
2. Click **Enable Analytics**
3. Add to `index.html` or Vercel enables automatically

Metrics tracked:
- Page views
- Core Web Vitals (LCP, FID, CLS)
- Geographic distribution
- Device types

### Runtime Logs

View server logs:
1. Go to **Deployments** tab
2. Click on a deployment
3. Click **Functions** tab (if using serverless functions)

For static sites (like this MVP), there are no runtime logs - only build logs.

---

## Rollback Procedures

### Instant Rollback

If a deployment has issues:

1. Go to **Deployments** tab
2. Find the last working deployment
3. Click three dots → **Promote to Production**
4. Confirm rollback

**Effect:** Instant - takes ~5 seconds to propagate globally.

### Pin a Deployment

To prevent accidental promotions:

1. Go to a deployment
2. Click **Pin Deployment**
3. This deployment URL becomes permanent

### Revert via Git

```bash
git revert HEAD
git push origin main
```

Vercel will automatically deploy the reverted commit.

---

## Troubleshooting

### Build Failures

**Error:** "Command 'pnpm run build' exited with 1"

**Fix:**
1. Check build logs in Vercel dashboard
2. Run `pnpm run build` locally to reproduce
3. Fix TypeScript errors: `npx tsc --noEmit`
4. Ensure all dependencies are in `package.json`
5. Redeploy: `vercel --prod`

### Environment Variables Not Working

**Error:** `import.meta.env.VITE_UNSPLASH_ACCESS_KEY` is `undefined`

**Fix:**
1. Verify variable name starts with `VITE_`
2. Check variable is added in Vercel dashboard
3. Ensure all environments (Production, Preview, Development) are checked
4. **Critical:** Redeploy after adding variables - they don't apply retroactively
5. Clear browser cache and hard reload

### 404 on Refresh (SPA Routing)

**Error:** Refreshing `/directory` shows 404

**Fix:**
Add `vercel.json` with rewrites:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This tells Vercel to serve `index.html` for all routes, letting React Router handle navigation.

### Slow Build Times

**Issue:** Builds taking >2 minutes

**Optimizations:**
1. Use `pnpm` instead of `npm` (faster dependency resolution)
2. Cache `node_modules` - Vercel does this automatically
3. Remove unused dependencies: `pnpm prune`
4. Check for large assets in `public/` folder

### Custom Domain Not Working

**Error:** "Domain is not configured correctly"

**Fix:**
1. Wait 24-48 hours for DNS propagation
2. Verify DNS records at https://dnschecker.org/
3. Ensure no conflicting records (e.g., old A records)
4. Try using nameservers instead of A/CNAME records
5. Contact Vercel support if issue persists >48 hours

---

## Cost Breakdown

### Free Tier (Hobby Plan)

Perfect for MVP:
- ✅ 100GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Edge network (global CDN)
- ✅ Preview deployments
- ✅ Team size: 1 developer

**Limits:**
- 6,000 build minutes/month (build time ~1 min = 6,000 deployments)
- 100 domains
- 24-hour log retention

### When to Upgrade (Pro Plan - $20/month)

Upgrade when you need:
- Team collaboration (multiple developers)
- Custom deploy hooks
- Password protection for previews
- Longer log retention (7 days)
- Priority support
- 1TB bandwidth/month

**For MVP:** Free tier is more than sufficient.

---

## Advanced: Preview Deployments

Every git branch gets a unique preview URL.

### Create a Preview
```bash
git checkout -b feature/new-design
# Make changes
git push origin feature/new-design
```

Vercel automatically deploys to:
```
https://travel-planner-git-feature-new-design.vercel.app
```

### Share with Team
- Preview URLs are public by default
- Share the URL for feedback
- Comment directly in Vercel dashboard

### Delete Preview
Previews are automatically deleted when:
- Branch is deleted
- PR is closed/merged

Manual delete:
1. Go to **Deployments** tab
2. Find preview deployment
3. Click three dots → **Delete**

---

## Advanced: Deployment Hooks

Trigger deployments via webhook (useful for CMS integrations).

### Create Deploy Hook
1. Go to **Settings** → **Git**
2. Scroll to **Deploy Hooks**
3. Click **Create Hook**
4. Name: `content-update`
5. Branch: `main`
6. Click **Create**

You'll get a webhook URL:
```
https://api.vercel.com/v1/integrations/deploy/prj_XXX/YYY
```

### Trigger Deployment
```bash
curl -X POST https://api.vercel.com/v1/integrations/deploy/prj_XXX/YYY
```

**Use case for v1.1+:** Trigger rebuild when CMS content changes.

---

## Summary

### Quick Commands

```bash
# First deployment
vercel --prod

# Subsequent deployments (with git integration)
git push origin main

# Add environment variable
vercel env add VARIABLE_NAME

# List deployments
vercel ls

# View logs
vercel logs [deployment-url]

# Alias deployment to custom domain
vercel alias [deployment-url] yourdomain.com
```

### Key URLs

- **Dashboard:** https://vercel.com/dashboard
- **Documentation:** https://vercel.com/docs
- **Status Page:** https://www.vercel-status.com/
- **Support:** https://vercel.com/support

---

## Next Steps

1. **Deploy MVP:** Run `vercel --prod` to deploy your first version
2. **Add Custom Domain:** Configure your domain in dashboard
3. **Enable Analytics:** Track Core Web Vitals and user behavior
4. **Set Up Git Integration:** Automatic deployments on push
5. **Share Preview URLs:** Get feedback before merging PRs

---

Last updated: 2026-02-18
