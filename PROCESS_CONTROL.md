# Process Control Guide for TrueFlow Landing Page

This guide provides proper startup, shutdown, and process management procedures for the TrueFlow landing page development server on localhost:3001.

## Quick Reference

| Command | Description |
|---------|-------------|
| `npm run dev:start` | Start server on port 3001 |
| `npm run dev:stop` | Stop the server gracefully |
| `npm run dev:restart` | Restart the server |
| `npm run dev:status` | Check server status |
| `npm run dev:logs` | View server logs |
| `npm run dev:clean` | Force kill all processes and start fresh |

## Prerequisites

Before starting the server, ensure:

1. **Port 3001 is available**
   ```bash
   lsof -i :3001  # Should return nothing if port is free
   ```

2. **Environment variables are configured**
   ```bash
   # Check .env.local exists and has valid values
   cat .env.local | grep -v "your_.*_here"
   ```

3. **Dependencies are installed**
   ```bash
   npm install
   ```

## Startup Procedures

### Standard Startup

1. **Check for existing processes**
   ```bash
   npm run dev:status
   ```

2. **Start the server**
   ```bash
   npm run dev:start
   ```

3. **Verify startup**
   ```bash
   # Wait 5 seconds, then check
   curl -I http://localhost:3001
   ```

### Background Startup (Daemon Mode)

For long-running development sessions:
```bash
npm run dev:daemon
```

This will:
- Start the server in background
- Save the process ID to `.pidfile`
- Log output to `dev-server.log`

## Shutdown Procedures

### Graceful Shutdown

1. **Standard shutdown**
   ```bash
   npm run dev:stop
   ```

2. **Verify shutdown**
   ```bash
   npm run dev:status  # Should show "No server running"
   ```

### Emergency Shutdown

If graceful shutdown fails:
```bash
npm run dev:clean
```

This force-kills all Next.js processes on port 3001.

## Process Management Best Practices

### 1. Always Check Before Starting

```bash
# Run this before starting
npm run dev:status
```

### 2. Use Proper Shutdown

Never use `Ctrl+C` in a background process. Always use:
```bash
npm run dev:stop
```

### 3. Monitor Logs

For debugging issues:
```bash
npm run dev:logs        # Real-time logs
npm run dev:logs:tail   # Last 100 lines
```

### 4. Handle Port Conflicts

If port 3001 is occupied:
```bash
# Find what's using it
lsof -i :3001

# Kill specific process
kill -9 <PID>

# Or use clean start
npm run dev:clean
```

## Troubleshooting

### Server Won't Start

1. **Check port availability**
   ```bash
   netstat -an | grep 3001
   ```

2. **Check for zombie processes**
   ```bash
   ps aux | grep -E "node|next" | grep 3001
   ```

3. **Clean start**
   ```bash
   npm run dev:clean
   ```

### Server Crashes Immediately

1. **Check logs**
   ```bash
   npm run dev:logs:tail
   ```

2. **Validate environment**
   ```bash
   npm run validate:env
   ```

3. **Check syntax errors**
   ```bash
   npm run lint
   ```

### Can't Access http://localhost:3001

1. **Verify server is running**
   ```bash
   curl http://localhost:3001/api/health
   ```

2. **Check firewall**
   ```bash
   # macOS
   sudo pfctl -s rules | grep 3001
   ```

3. **Try different browser or incognito mode**

## Environment Variable Management

### Required Variables

```bash
# .env.local must contain:
RESEND_API_KEY=re_xxxxxxxxxxxxx  # Not a placeholder!
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Validate Environment

```bash
npm run validate:env
```

This checks for:
- Missing required variables
- Placeholder values
- Invalid formats

## Process State Files

The following files track process state:

| File | Purpose |
|------|---------|
| `.pidfile` | Contains the process ID of running server |
| `dev-server.log` | Server output logs |
| `.port-lock` | Prevents multiple servers on same port |
| `.last-start` | Timestamp of last server start |

## Advanced Usage

### Using PM2 (Recommended for Stability)

1. **Install PM2**
   ```bash
   npm install -g pm2
   ```

2. **Start with PM2**
   ```bash
   pm2 start ecosystem.config.js
   ```

3. **PM2 Commands**
   ```bash
   pm2 status          # Check status
   pm2 logs            # View logs
   pm2 restart landing # Restart
   pm2 stop landing    # Stop
   pm2 delete landing  # Remove from PM2
   ```

### Health Checks

The server includes health check endpoints:

```bash
# Basic health
curl http://localhost:3001/api/health

# Detailed status
curl http://localhost:3001/api/health/detailed
```

## Script Implementation

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "dev": "next dev -p 3001",
    "dev:start": "npm run dev:status || npm run dev",
    "dev:daemon": "nohup npm run dev > dev-server.log 2>&1 & echo $! > .pidfile",
    "dev:stop": "[ -f .pidfile ] && kill $(cat .pidfile) && rm .pidfile || echo 'No server running'",
    "dev:restart": "npm run dev:stop && sleep 2 && npm run dev:start",
    "dev:status": "[ -f .pidfile ] && ps -p $(cat .pidfile) > /dev/null && echo 'Server running (PID: '$(cat .pidfile)')' || echo 'No server running'",
    "dev:logs": "tail -f dev-server.log",
    "dev:logs:tail": "tail -n 100 dev-server.log",
    "dev:clean": "pkill -f 'next.*3001' || true && rm -f .pidfile && echo 'Cleaned up processes'",
    "validate:env": "node scripts/validate-env.js"
  }
}
```

## Maintenance Schedule

- **Daily**: Check logs for errors
- **Weekly**: Clean up old log files
- **Monthly**: Update dependencies and check for security updates

## Emergency Contacts

If the server is down in production:
1. Check deployment platform status (Railway/Vercel/Netlify)
2. Review recent commits for breaking changes
3. Check environment variables in deployment platform

---

Last updated: 2025-07-23
Version: 1.0.0