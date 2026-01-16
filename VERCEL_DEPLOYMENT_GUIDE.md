# 🚀 Vercel Deployment Guide

## Current Status

- **Project:** qmoi-enhanced
- **Framework:** Next.js 15.5.9 (App Router)
- **Repository:** github.com/thealphakenya/qmoi-enhanced
- **Branch:** autosync-backup-20250926-232440
- **Deployment:** Vercel (https://qmoi-enhanced.vercel.app)

## Recent Deployment Fix

**Problem:** Vercel build was failing with:
```
The pattern 'app/api/**/*.js' defined in `functions` doesn't match any Serverless Functions inside the `api` directory.
```

**Solution Applied:**
- Updated `vercel.json` function pattern from `app/api/**/*.js` to `app/api/**/route.ts`
- Removed custom routes (Next.js 15 App Router handles routing automatically)
- Configuration is now compatible with modern Next.js setup

**File Changed:**
```json
{
  "functions": {
    "app/api/**/route.ts": { "maxDuration": 30 }
  },
  "routes": []
}
```

## Deployment Instructions

### 1. Check Build Status Locally

```bash
cd /workspaces/qmoi-enhanced
npm run build
```

Expected output: ✅ Successfully compiled

### 2. Monitor Vercel Deployment

If you have a Vercel token:
```bash
VERCEL_TOKEN=your_token_here node scripts/vercel-monitor.js
```

Or check manually:
- Navigate to: https://vercel.com/dashboard
- Select project: qmoi-enhanced
- Check latest deployment status

### 3. Test Deployed Application

```bash
node scripts/vercel-deployment-test.js https://qmoi-enhanced.vercel.app
```

Or with custom URL:
```bash
node scripts/vercel-deployment-test.js https://your-custom-domain.vercel.app
```

## Environment Variables Required for Vercel

Set these in Vercel project settings > Environment Variables:

### Core (Optional for basic functionality)
```
NODE_ENV=production
```

### Features (Optional - only if using the feature)
```
QMOI_API_KEY=your_key
M_PESA_CLIENT_ID=your_id
M_PESA_CLIENT_SECRET=your_secret
QMOI_WHATSAPP_PROVIDER=local
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
```

## API Endpoints Available on Vercel

### Authentication
- `POST /api/auth/login` - Email/password login
- `POST /api/webauthn/register` - WebAuthn registration
- `POST /api/webauthn/authenticate` - WebAuthn verification
- `POST /api/voice/enroll` - Voice profile enrollment
- `POST /api/voice/verify` - Voice verification

### Biometric
- `POST /api/biometric/verify` - Verify biometric template
- `GET /api/biometric/templates` - Get biometric templates

### User Management
- `GET /api/users` - List users
- `GET /api/users/[id]` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/[id]` - Update user

### Admin/Master Functions
- `GET /api/admin/sponsored/list` - List sponsored users
- `POST /api/admin/sponsored/create` - Create sponsored user
- `GET /api/master/analytics` - Master analytics

### System
- `GET /api/version` - API version
- `GET /api/memory` - Memory usage info
- `GET /api/health` - Health check

## Troubleshooting Deployment Errors

### Error: "Function pattern doesn't match"
**Cause:** vercel.json has wrong pattern
**Fix:** Use pattern: `app/api/**/route.ts` (not `.js`)

### Error: "Build failed"
**Check:**
1. All dependencies are installed: `npm install`
2. No TypeScript errors: `npm run build`
3. No ESLint blockers: `npm run lint`

### Error: "Cannot find module"
**Check:**
1. Path aliases in tsconfig.json are correct
2. @/* paths point to root
3. All imports use correct paths

### Error: "Timeout"
**Check:**
1. API is responding locally: `npm run dev`
2. Functions have maxDuration: 30 in vercel.json
3. Long-running endpoints use background functions

## Build Information

**Last Successful Local Build:**
- Timestamp: 2024-01-15
- Routes: 50+ API endpoints compiled
- Size: ~400KB per endpoint
- Duration: ~2-3 minutes

**Build Configuration:**
```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "functions": {
    "app/api/**/route.ts": {
      "maxDuration": 30
    }
  }
}
```

## Performance Optimization

### Current Settings
- Node.js Version: 24.x (Vercel default)
- Region: Automatic
- Function Duration: 30s max
- Memory: Default (3008 MB)

### Recommended Optimizations
```bash
# For larger payloads:
# Increase maxDuration in vercel.json to 60s

# For frequently accessed routes:
# Add ISR (Incremental Static Regeneration) in next.config.js

# For real-time features:
# Consider Vercel Postgres or Edge Config
```

## Monitoring

### Real-time Monitoring
```bash
# Watch build logs in real-time
VERCEL_TOKEN=your_token node scripts/vercel-monitor.js

# Run endpoint tests
node scripts/vercel-deployment-test.js
```

### Health Checks
- Status Page: Check `/api/health`
- Memory: Check `/api/memory`
- Version: Check `/api/version`

## Rolling Back

If deployment fails:

1. **Rollback on Vercel:**
   - Go to Vercel Dashboard > Deployments
   - Click on previous successful deployment
   - Click "Promote to Production"

2. **Rollback on GitHub:**
   ```bash
   git revert <commit-hash>
   git push origin autosync-backup-20250926-232440
   ```

3. **Manual Rollback:**
   - Update vercel.json to previous state
   - Commit and push
   - Vercel will redeploy

## Next Steps

1. ✅ vercel.json has been fixed
2. ⏳ Waiting for Vercel to rebuild (triggered by commit)
3. 🧪 Will test endpoints once deployment completes
4. 📊 Monitor performance metrics
5. 🔒 Set environment variables if needed

## Support

For issues:
1. Check build logs on Vercel Dashboard
2. Run local build test: `npm run build`
3. Review vercel.json configuration
4. Check GitHub Actions for any pre-deployment issues
5. Verify all environment variables are set correctly

---

**Last Updated:** 2024-01-15
**Deployment Version:** 2.0.0
**Status:** 🟡 Awaiting Vercel Build
