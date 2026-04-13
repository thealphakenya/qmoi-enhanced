# ROUTES.md - Complete Route Directory

**Last Updated**: 2026-04-13T23:45:32.138264
**Version**: 2.0.0
**Total Routes**: 25+

## Route Categories

### QMOI Core Routes
```
GET    /api/qmoi-model              Retrieve model info
PUT    /api/qmoi-model              Update configuration
POST   /api/qmoi/autodev            Trigger AutoDev
PUT    /api/qmoi/autodev            Update AutoDev settings
POST   /api/qmoi/suggestions        Get suggestions
PUT    /api/qmoi/suggestions        Update preferences
GET    /api/qmoi/own-device-logs    Retrieve device logs
PUT    /api/qmoi/own-device-logs    Update log settings
POST   /api/qmoi/own-device-logs    Clear/upload logs
GET    /api/qmoi/backup             List backups
```

### AI Feature Routes
```
POST   /api/reasoning/process       Recursive thinking (Pillar 1)
POST   /api/multimodal/process      Multimodal streams (Pillar 4)
POST   /api/healing/analyze         Error analysis (Pillar 3)
POST   /api/healing/apply           Apply fixes
GET    /api/benchmarking/autorate   Compare models
POST   /api/benchmarking/autorate   Trigger benchmark
```

### Deployment Routes
```
PUT    /api/deploy                  Deploy system
GET    /api/deploy                  Check status
PUT    /api/deploy/auto-redeploy    Auto redeploy
```

### Git Integration Routes
```
PUT    /api/git/commit              Commit changes
PUT    /api/git/push                Push to repo
POST   /api/git/pr                  Create PR
```

### Financial Routes
```
GET    /api/wallet                  Get balance
POST   /api/wallet                  Create transaction
PUT    /api/wallet                  Update settings
```

### Health Routes
```
GET    /api/health                  System health
PUT    /api/health                  Reset checks
GET    /api/qmoi/revenue-dashboard  Revenue metrics
```

### Admin Routes
```
PUT    /api/master/domains/emergency-takeover      Domain failover
GET    /api/master/sponsored/analytics             Partner analytics
PUT    /api/master/sponsored/analytics             Update settings
```

### QVillage Routes
```
GET    /api/webhooks/qvillage       List webhooks
POST   /api/webhooks/qvillage       Register webhook
PUT    /api/webhooks/qvillage       Update webhook
```

## Route Pattern Standards

```
GET    /api/resource          List all items
POST   /api/resource          Create new item
GET    /api/resource/[id]     Get specific item
PUT    /api/resource/[id]     Update item
DELETE /api/resource/[id]     Delete item
```

---

**Auto-Updated**: 2026-04-13T23:45:32.138264
**Status**: All 25+ routes documented
