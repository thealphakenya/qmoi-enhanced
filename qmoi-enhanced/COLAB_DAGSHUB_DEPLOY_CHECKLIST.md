<!-- QMOI_OWNER_START -->
owner: unknown
role: unknown
updated_at: 2025-11-22T13:51:58Z
<!-- QMOI_OWNER_END -->

<!-- LION_VALIDATION_START -->
## 🦁 L — Validated by QMOI Lion

- validated: yes
- validator: QMOI Lion
- timestamp: 2025-10-25T00:32:32.231969Z
- note: Auto-inserted by `scripts/autotag_md_with_lion.py` (creates .bak backup)
<!-- LION_VALIDATION_END -->

# QMOI Colab/Dagshub Deployment Checklist

## 1. Prepare Your Environment
- [ ] Ensure you have a Colab or Dagshub account
- [ ] Clone your QMOI repository to the cloud environment
- [ ] Install required dependencies (e.g., `pip install -r requirements.txt`, `npm install`)

## 2. Configure Environment Variables
- [ ] Set `GMAIL_USER` to your Gmail address (e.g., rovicviccy@gmail.com)
- [ ] Set `GMAIL_PASS` to your Gmail App Password (never your main password)
- [ ] Set `GMAIL_RECIPIENT` to all desired notification recipients (comma-separated)
- [ ] (Optional) Use a secrets manager or Colab/Dagshub environment variable injection for security

## 3. Run QMOI Automation
- [ ] Start the main automation script (e.g., `python scripts/qmoi-qcity-automatic.py`)
- [ ] Confirm that documentation fixing, deployments, and notifications are running
- [ ] Check logs for any errors or issues

## 4. Test Notification System
- [ ] Trigger a doc fix or deployment event
- [ ] Confirm that all recipients receive Gmail notifications
- [ ] Check notification logs for delivery status

## 5. Monitor & Maintain
- [ ] Monitor the dashboard for real-time status and logs
- [ ] Rotate Gmail App Passwords regularly
- [ ] Update recipients as needed
- [ ] Use lightweight, parallel features to ensure minimal resource usage

---
**QMOI is now cloud-ready, always-on, and fully automated for Colab/Dagshub deployments!**

<!-- QMOI_VALIDATION_START -->
{
  "file": "qmoi-enhanced/COLAB_DAGSHUB_DEPLOY_CHECKLIST.md",
  "validated_at": "2025-10-26T20:51:24.603706Z",
  "validator": "QMOI Lion (automated)",
  "checks": [
    {
      "name": "title_present",
      "ok": true,
      "detail": "QMOI Colab/Dagshub Deployment Checklist"
    },
    {
      "name": "links",
      "ok": true,
      "detail": []
    }
  ],
  "passed": true,
  "summary": {
    "total_checks": 2,
    "passed": true
  }
}
<!-- QMOI_VALIDATION_END -->
