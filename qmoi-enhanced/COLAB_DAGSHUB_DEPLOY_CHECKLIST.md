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
