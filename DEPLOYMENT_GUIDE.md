# TrueFlow Landing Page Deployment Guide

**⚠️ IMPORTANT: This guide is specifically for the TrueFlow Landing Page, NOT the main TrueFlow UI application.**

This guide explains how to successfully build and deploy changes to the TrueFlow landing page on GitHub and Railway. The landing page is a separate, standalone Next.js application with its own repository and deployment pipeline.

## Prerequisites

- Git installed locally
- Access to the GitHub repository: `griffinkrutherford/TrueFlow-Landing-Page` (NOT the main UI repo)
- Railway project connected to the GitHub repository
- Node.js 18+ installed locally

## Repository Structure

**Landing Page Location** (separate from main UI):
```
/Users/griffinrutherford/Documents/TrueFlow AI MVP/apps/landing/
```

## Local Development

1. **Navigate to the landing page directory:**
   ```bash
   cd "/Users/griffinrutherford/Documents/TrueFlow AI MVP/apps/landing"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```
   The site will be available at `http://localhost:3001`

## Making Changes

1. **Edit the main page:**
   - Primary landing page: `app/page.tsx`
   - Styles: `app/globals.css`
   - Other pages: `app/coming-soon/page.tsx`, `app/faq/page.tsx`, etc.

2. **Test locally:**
   ```bash
   npm run build
   npm start
   ```

## Deployment Process

### Step 1: Commit Changes

1. **Check git status:**
   ```bash
   git status
   ```

2. **Stage your changes:**
   ```bash
   git add .
   # Or stage specific files:
   git add app/page.tsx
   ```

3. **Commit with a descriptive message:**
   ```bash
   git commit -m "fix: update pricing section and footer links"
   ```

### Step 2: Push to GitHub

```bash
git push origin main
```

This push will automatically trigger a Railway deployment.

### Step 3: Monitor Deployment

1. Check the Railway dashboard for deployment status
2. View build logs if there are any issues

## Important Configuration Files

### 1. `railway.json`
Controls Railway deployment settings:
```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build",
    "watchPatterns": ["**/*", "package.json", "package-lock.json"]
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/",
    "healthcheckTimeout": 300
  }
}
```

### 2. `nixpacks.toml`
Defines build phases:
```toml
[phases.setup]
nixPkgs = ["nodejs-18_x"]

[phases.install]
cmds = ["npm ci"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "PORT=${PORT:-3001} npm start"
```

## Common Issues and Solutions

### 1. Missing Dependencies
**Error:** `Cannot find module`
**Solution:** Run `npm install` locally and commit `package-lock.json`

### 2. Build Failures
**Error:** `npm ci` fails
**Solution:** 
- Ensure `package-lock.json` exists and is committed
- Don't run `npm ci` twice in the build process

### 3. Port Conflicts
**Error:** Port already in use
**Solution:** The app uses port 3001 by default. Ensure no other services use this port.

### 4. Remote Repository Issues
**Error:** `failed to push some refs`
**Solution:** Pull latest changes first:
```bash
git pull origin main --rebase
git push origin main
```

## Best Practices

1. **Always test locally before pushing:**
   ```bash
   npm run build
   npm start
   ```

2. **Write clear commit messages:**
   - `fix:` for bug fixes
   - `feat:` for new features
   - `docs:` for documentation updates
   - `style:` for formatting changes

3. **Keep dependencies up to date:**
   ```bash
   npm update
   npm audit fix
   ```

4. **Monitor deployment logs:**
   - Check Railway dashboard after each push
   - Review build logs for any warnings or errors

## Quick Deployment Checklist

- [ ] Changes tested locally with `npm run build`
- [ ] All files saved
- [ ] Changes committed with descriptive message
- [ ] Pushed to GitHub main branch
- [ ] Railway deployment triggered automatically
- [ ] Deployment successful in Railway dashboard
- [ ] Live site checked at production URL

## Environment Variables

Environment variables are managed in Railway's dashboard:
- `NODE_ENV`: production
- `PORT`: 3001
- `NEXT_TELEMETRY_DISABLED`: 1

## Support

For issues:
1. Check Railway build logs
2. Verify all configuration files are correct
3. Ensure GitHub repository connection is active
4. Check that all dependencies are properly installed

## Additional Notes

- **This is the landing page deployment only** - The main TrueFlow UI has a different deployment process
- The landing page is a standalone Next.js app, separate from the main application
- The site automatically deploys when changes are pushed to the main branch
- Railway uses Nixpacks for building the Next.js application
- The production URL is: `trueflow-landing-page-production.up.railway.app`
- Always use `npm` commands (not `pnpm`) as configured in the deployment files

## Difference from Main UI Deployment

The main TrueFlow UI application:
- Is located in the parent directory
- Uses a different repository: `griffinkrutherford/TrueFlow-UI`
- Has its own deployment configuration
- May use different build commands and dependencies

**Make sure you're in the correct directory and repository when deploying!**