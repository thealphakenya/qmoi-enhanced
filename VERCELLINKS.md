# QMOI Enhanced - Vercel Deployment Links

**Last Updated:** January 18, 2026 at 16:17 UTC
**Status:** Ready for Verification  
**Auto-Update:** Enabled ✓

---

## 🌐 Primary Application Links

### Production Deployment

- **Main Application**: https://qmoi-enhanced.vercel.app
  - Status: 404 (Deployment in progress)
  - Expected Status: 200 OK
  - Health Check: https://qmoi-enhanced.vercel.app/api/health

### API Endpoints

- **API Base**: https://qmoi-enhanced.vercel.app/api
- **API Health**: https://qmoi-enhanced.vercel.app/api/health
- **API Version**: https://qmoi-enhanced.vercel.app/api/version
- **API Metrics**: https://qmoi-enhanced.vercel.app/api/metrics

---

## 📊 Vercel Dashboard & Monitoring

### Vercel Console

- **Project Dashboard**: https://vercel.com/thealphakenya/qmoi-enhanced
  - Status: 200 OK ✓
  - Check: Deployment status, logs, and metrics

### Settings & Configuration

- **Domains**: https://vercel.com/thealphakenya/qmoi-enhanced/settings/domains
- **Environment**: https://vercel.com/thealphakenya/qmoi-enhanced/settings/environment-variables
- **Git Integration**: https://vercel.com/thealphakenya/qmoi-enhanced/settings/git
- **Analytics**: https://vercel.com/thealphakenya/qmoi-enhanced/analytics

---

## 🔧 Repository & Code

### GitHub Repository

- **Repository**: https://github.com/thealphakenya/qmoi-enhanced
  - Status: 200 OK ✓
  - Commits: https://github.com/thealphakenya/qmoi-enhanced/commits/autosync-backup-20250926-232440
  - Latest Commit: 5fb6ac085

### Code Views

- **Main Branch**: https://github.com/thealphakenya/qmoi-enhanced/tree/autosync-backup-20250926-232440
- **Commit History**: https://github.com/thealphakenya/qmoi-enhanced/commits
- **Pull Requests**: https://github.com/thealphakenya/qmoi-enhanced/pulls
- **Issues**: https://github.com/thealphakenya/qmoi-enhanced/issues

---

## 🎯 Testing Endpoints (After Deployment Live)

### Health & Status Endpoints

```
GET  https://qmoi-enhanced.vercel.app/api/health
GET  https://qmoi-enhanced.vercel.app/api/version
GET  https://qmoi-enhanced.vercel.app/api/metrics
GET  https://qmoi-enhanced.vercel.app/api/status
```

### Authentication Endpoints

```
POST https://qmoi-enhanced.vercel.app/api/auth/register
POST https://qmoi-enhanced.vercel.app/api/auth/login
POST https://qmoi-enhanced.vercel.app/api/auth/refresh
POST https://qmoi-enhanced.vercel.app/api/auth/logout
```

### User Management Endpoints

```
GET  https://qmoi-enhanced.vercel.app/api/users/profile
POST https://qmoi-enhanced.vercel.app/api/users/profile
GET  https://qmoi-enhanced.vercel.app/api/users/{id}
PUT  https://qmoi-enhanced.vercel.app/api/users/{id}
DELETE https://qmoi-enhanced.vercel.app/api/users/{id}
```

### Wallet Endpoints

```
GET  https://qmoi-enhanced.vercel.app/api/wallets
POST https://qmoi-enhanced.vercel.app/api/wallets
GET  https://qmoi-enhanced.vercel.app/api/wallets/{id}
PUT  https://qmoi-enhanced.vercel.app/api/wallets/{id}
```

### Admin Endpoints (Requires Token)

```
GET  https://qmoi-enhanced.vercel.app/api/admin/dashboard
GET  https://qmoi-enhanced.vercel.app/api/admin/audit-logs
GET  https://qmoi-enhanced.vercel.app/api/admin/users
GET  https://qmoi-enhanced.vercel.app/api/admin/metrics
```

---

## 📋 Link Status Summary

| Link                                           | Type      | Status        | Last Verified | Next Check |
| ---------------------------------------------- | --------- | ------------- | ------------- | ---------- |
| https://qmoi-enhanced.vercel.app               | App       | 404 (Pending) | Jan 18, 2026  | AUTO       |
| https://qmoi-enhanced.vercel.app/api           | API       | 404 (Pending) | Jan 18, 2026  | AUTO       |
| https://qmoi-enhanced.vercel.app/api/health    | Health    | 404 (Pending) | Jan 18, 2026  | AUTO       |
| https://vercel.com/thealphakenya/qmoi-enhanced | Dashboard | 200 ✓         | Jan 18, 2026  | AUTO       |
| https://github.com/thealphakenya/qmoi-enhanced | GitHub    | 200 ✓         | Jan 18, 2026  | AUTO       |

---

## 🔄 Auto-Update Configuration

### How Auto-Update Works

The `update_vercel_links.sh` script automatically:

1. Tests all deployment links for HTTP status
2. Updates link status in this file
3. Checks if deployment is live (200 response)
4. Updates timestamp and status indicators
5. Runs on schedule via cron or Git hooks

### Running Manual Update

```bash
# Make script executable
chmod +x update_vercel_links.sh

# Run link verification and auto-update
./update_vercel_links.sh

# Or use with npm
npm run update-links
```

### Automatic Scheduling

Add to crontab to run every 5 minutes:

```bash
*/5 * * * * cd /workspaces/qmoi-enhanced && ./update_vercel_links.sh >> /var/log/qmoi-links.log 2>&1
```

### Git Hook Integration

Link update runs automatically on:

- Post-push hook (after code push)
- Post-deployment hook (after Vercel deployment)
- Pre-commit hook (before committing code)

---

## 📊 Deployment Verification Checklist

### Phase 1: Pre-Deployment (✓ Complete)

- [x] Code committed and pushed to GitHub
- [x] Build verified locally (0 errors, 22.2 seconds)
- [x] vercel.json configuration verified
- [x] All services implemented and exported
- [x] Error handling configured

### Phase 2: Deployment (⏳ In Progress)

- [ ] Vercel receives webhook from GitHub
- [ ] Dependencies installation begins
- [ ] Build process runs (3-4 minutes)
- [ ] Assets deployed to CDN
- [ ] SSL certificate activated
- [ ] Application goes live

### Phase 3: Post-Deployment (⏭️ Next)

- [ ] Application URL returns 200 OK
- [ ] Health check endpoint responds
- [ ] GitHub shows green deployment check
- [ ] All API endpoints respond
- [ ] Environment variables configured
- [ ] Database connection verified

---

## 🚀 Quick Actions

### View Deployment Status

```bash
# Open Vercel dashboard
open https://vercel.com/thealphakenya/qmoi-enhanced

# Or check deployment logs
curl -s https://api.vercel.com/v6/deployments?limit=1
```

### Test Application

```bash
# Check if live
curl https://qmoi-enhanced.vercel.app

# Test health endpoint
curl https://qmoi-enhanced.vercel.app/api/health

# Test with verbose output
curl -v https://qmoi-enhanced.vercel.app/api/health
```

### Monitor Auto-Updates

```bash
# View auto-update logs
tail -f /var/log/qmoi-links.log

# Check last update time
ls -l VERCELLINKS.md

# Manually trigger update
./update_vercel_links.sh --verbose
```

---

## 📝 Repository Information

- **Owner**: thealphakenya
- **Repository**: qmoi-enhanced
- **Branch**: autosync-backup-20250926-232440
- **Latest Commit**: 5fb6ac085
- **Commit Message**: "fix: resolve production build issues and add missing service exports"

---

## 🎯 Expected Deployment Timeline

| Time | Event                         |
| ---- | ----------------------------- |
| 0:00 | Webhook received by Vercel    |
| 0:30 | Dependencies installation     |
| 2:00 | Build process running         |
| 3:30 | Assets deployed to CDN        |
| 4:00 | SSL certificate activated     |
| 5:00 | Application live and verified |

**Current Time**: January 18, 2026  
**Build Status**: ✓ READY FOR DEPLOYMENT

---

## 🔐 Security Notes

- All links use HTTPS
- API endpoints require authentication tokens
- Admin endpoints require elevated permissions
- Environment variables securely stored in Vercel
- No credentials in VERCELLINKS.md

---

## 📞 Support & Troubleshooting

### Links Return 404

- **Cause**: Deployment not yet complete
- **Solution**: Wait 5-6 minutes, then refresh
- **Verify**: Check Vercel dashboard for "Ready" status

### Links Return 5xx Errors

- **Cause**: Deployment failed or crashing
- **Solution**: Check Vercel dashboard logs
- **Fix**: Review error messages and redeploy

### Auto-Update Not Working

- **Cause**: Script permissions or schedule issue
- **Solution**: Run `chmod +x update_vercel_links.sh`
- **Check**: Verify cron job is running

### Missing Environment Variables

- **Cause**: Variables not configured in Vercel
- **Solution**: Add to Vercel dashboard → Settings → Environment Variables
- **Required**: DATABASE_URL, JWT_SECRET, STRIPE_SECRET_KEY, SENDGRID_API_KEY

---

## 📚 Documentation Links

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [GitHub Actions](https://github.com/features/actions)
- [Deployment Guide](./BUILD_INSTRUCTIONS_PRODUCTION.md)

---

**Auto-Generated by QMOI Auto-Deploy System**  
**Next Verification**: Automatic (every 5 minutes)  
**Last Status Check**: January 18, 2026 at 00:00 UTC
