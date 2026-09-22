const nodemailer = require('nodemailer');
const fs = require('fs');
require('dotenv').config();

const EMAIL_USER = process.env.QMOI_EMAIL_USER || 'rovicviccy@gmail.com';
const EMAIL_PASS = process.env.QMOI_EMAIL_PASS;
const EMAIL_TO = 'rovicviccy@gmail.com';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: EMAIL_USER, pass: EMAIL_PASS }
});

async function sendHealingSummary(summary) {
  try {
    await transporter.sendMail({
      from: `QMOI <${EMAIL_USER}>`,
      to: EMAIL_TO,
      subject: 'QMOI Healing Summary',
      text: summary
    });
    fs.appendFileSync('logs/qmoispace_email.log', `[${new Date().toISOString()}] Sent healing summary\n`);
  } catch (e) {
    fs.appendFileSync('logs/qmoispace_email.log', `[${new Date().toISOString()}] Email error: ${e.message}\n`);
  }
}

async function sendFeedback(message, from) {
  try {
    await transporter.sendMail({
      from: `QMOI Feedback <${EMAIL_USER}>`,
      to: EMAIL_TO,
      subject: 'QMOI User Feedback',
      text: `From: ${from || 'anonymous'}\n\n${message}`
    });
    fs.appendFileSync('logs/qmoispace_email.log', `[${new Date().toISOString()}] Sent feedback\n`);
  } catch (e) {
    fs.appendFileSync('logs/qmoispace_email.log', `[${new Date().toISOString()}] Email error: ${e.message}\n`);
  }
}

module.exports = { sendHealingSummary, sendFeedback }; 