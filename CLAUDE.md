# Claude Code Instructions - TrueFlow Landing Page

This file contains specific instructions for Claude Code when working with the TrueFlow landing page project. Claude Code automatically reads this file at the start of each session.

## Project Overview

- **Project**: TrueFlow Landing Page
- **Location**: `/trueflow-landing-repo`
- **Port**: 3001 (ALWAYS use this port for the landing page)
- **Framework**: Next.js 14.2.30

## Critical Instructions

### 1. Server Management on Port 3001

**ALWAYS follow these steps when asked to start the landing page:**

1. **First, check if anything is running on port 3001:**
   ```bash
   lsof -i :3001
   ```

2. **If something is running, kill it:**
   ```bash
   lsof -ti:3001 | xargs kill -9 2>/dev/null || echo "Port already free"
   ```

3. **Wait 2 seconds for port to be freed:**
   ```bash
   sleep 2
   ```

4. **Start the server:**
   ```bash
   cd "/Users/griffinrutherford/Documents/TrueFlow AI MVP/trueflow-landing-repo" && npm run dev
   ```

### 2. Environment Variables

**ALWAYS check these before starting:**

- The `.env.local` file must exist
- `RESEND_API_KEY` must NOT contain "your_" placeholder text
- If missing, warn the user that email notifications will fail

### 3. Common Issues and Solutions

**Port Conflict:**
- The main app (`/apps/web`) uses port 3000
- The landing page uses port 3001
- NEVER change these port assignments

**Server Won't Start:**
1. Kill all Next.js processes: `pkill -f "next.*3001"`
2. Remove stale lock files: `rm -f .next/cache/webpack.lock`
3. Clear Next.js cache: `rm -rf .next`

**Background Process:**
- Use `nohup npm run dev > dev-server.log 2>&1 & echo $!` for background execution
- Always save the PID for later cleanup

### 4. File Locations

- **Main landing page**: `/app/page.tsx`
- **API routes**: `/app/api/`
- **Environment config**: `/.env.local`
- **Process control guide**: `/PROCESS_CONTROL.md`

### 5. Do NOT Modify

- Port configuration (always 3001)
- Package name (@trueflow/landing)
- Build/deployment configurations

### 6. Testing After Start

Always verify the server is running:
```bash
curl -I http://localhost:3001
```

Expected: HTTP/1.1 200 OK

### 7. Shutdown Procedure

When stopping the server:
1. Try graceful shutdown first: `Ctrl+C` in terminal
2. If that fails: `lsof -ti:3001 | xargs kill -9`
3. Verify it's stopped: `lsof -i :3001` (should be empty)

## Automated Checks

When starting the landing page server, automatically:

1. ✓ Check port availability
2. ✓ Verify environment variables
3. ✓ Clear any stale processes
4. ✓ Start in appropriate mode (foreground for testing, background for long-term)
5. ✓ Verify successful startup with curl

## Error Handling

If errors occur:
1. Check `dev-server.log` for details
2. Verify no syntax errors with `npm run lint`
3. Ensure all dependencies are installed with `npm install`
4. Check for uncommitted changes that might break the build

## Integration Notes

- This landing page is separate from the main TrueFlow app
- It has its own package.json and dependencies
- It should always run independently on port 3001
- Do not merge with the main app's dev server

---

**Last Updated**: 2025-07-23
**Version**: 1.0.0
**Auto-read**: This file is automatically read by Claude Code at session start