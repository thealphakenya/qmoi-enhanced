const nodemailer = import("nodemailer");
const fetch = import("node-fetch");
let sendgrid;
try {
  sendgrid = import("@sendgrid/mail");
} catch (e) {
  sendgrid = null;
}

async function sendEmail(subject, text, to) {
  const recipients = to || process.env.QMOI_EMAIL_TO;

  // Prefer SendGrid when API key provided
  if (process.env.SENDGRID_API_KEY && sendgrid) {
    try {
      sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: recipients,
        from: process.env.EMAIL_FROM || process.env.QMOI_EMAIL_FROM || process.env.QMOI_EMAIL_USER,
        subject: subject,
        text: text,
      };
      await sendgrid.send(msg);
      return;
    } catch (err) {
      console.error("SendGrid send failed:", err && err.message ? err.message : err);
      // fall through to SMTP option
    }
  }

  // Fallback to SMTP via nodemailer when SMTP envs present
  const smtpHost = process.env.QMOI_EMAIL_HOST || process.env.SMTP_HOST;
  const smtpPort = process.env.QMOI_EMAIL_PORT || process.env.SMTP_PORT;
  const smtpUser = process.env.QMOI_EMAIL_USER || process.env.SMTP_USER;
  const smtpPass = process.env.QMOI_EMAIL_PASS || process.env.SMTP_PASS;
  const fromAddress = process.env.EMAIL_FROM || process.env.QMOI_EMAIL_FROM || process.env.QMOI_EMAIL_USER;

  if (smtpHost && smtpPort && smtpUser && smtpPass && recipients) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort, 10),
        secure: parseInt(smtpPort, 10) === 465,
        auth: { user: smtpUser, pass: smtpPass },
      });
      await transporter.sendMail({ from: fromAddress, to: recipients, subject, text });
      return;
    } catch (err) {
      console.error("SMTP send failed:", err && err.message ? err.message : err);
    }
  }

  // No configured provider — log and noop
  console.warn("No email provider configured (SENDGRID_API_KEY or SMTP). Skipping sendEmail.");
}

async function sendSlack(message) {
  if (!process.env.QMOI_SLACK_WEBHOOK) return;
  await apiClient.get(process.env.QMOI_SLACK_WEBHOOK, {
    method: "POST",
    body: JSON.stringify({ text: message }),
    headers: { "Content-Type": "application/json" },
  });
}

async function sendWhatsApp(message) {
  if (!process.env.QMOI_WHATSAPP_API_URL || !process.env.QMOI_WHATSAPP_TO)
    return;
  await apiClient.get(process.env.QMOI_WHATSAPP_API_URL, {
    method: "POST",
    body: JSON.stringify({ to: process.env.QMOI_WHATSAPP_TO, message }),
    headers: { "Content-Type": "application/json" },
  });
}

module.exports = { sendEmail, sendSlack, sendWhatsApp };
