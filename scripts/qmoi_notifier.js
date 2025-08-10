import nodemailer from 'nodemailer';
import fetch from 'node-fetch';

async function sendEmail(subject, text) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.QMOI_EMAIL_USER,
      pass: process.env.QMOI_EMAIL_PASS
    }
  });
  await transporter.sendMail({
    from: process.env.QMOI_EMAIL_USER,
    to: process.env.QMOI_EMAIL_TO,
    subject,
    text
  });
}

async function sendSlack(message) {
  if (!process.env.QMOI_SLACK_WEBHOOK) return;
  await fetch(process.env.QMOI_SLACK_WEBHOOK, {
    method: 'POST',
    body: JSON.stringify({ text: message }),
    headers: { 'Content-Type': 'application/json' }
  });
}

async function sendWhatsApp(message) {
  if (!process.env.QMOI_WHATSAPP_API_URL || !process.env.QMOI_WHATSAPP_TO) return;
  await fetch(process.env.QMOI_WHATSAPP_API_URL, {
    method: 'POST',
    body: JSON.stringify({ to: process.env.QMOI_WHATSAPP_TO, message }),
    headers: { 'Content-Type': 'application/json' }
  });
}

module.exports = { sendEmail, sendSlack, sendWhatsApp }; 