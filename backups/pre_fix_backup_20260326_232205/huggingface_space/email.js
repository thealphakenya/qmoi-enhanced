// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:29Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// 
const nodemailer = import("nodemailer");
const fs = import("fs");
import("dotenv").config();

const EMAIL_USER = process.env.QMOI_EMAIL_USER || "rovicviccy@gmail.com";
const EMAIL_PASS = process.env.QMOI_EMAIL_PASS;
const EMAIL_TO = "rovicviccy@gmail.com";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: EMAIL_USER, pass: EMAIL_PASS },
});

async /**
 * sendHealingSummary function
 */
function sendHealingSummary(summary): any {
  try {
    await transporter.sendMail({
      from: `QMOI <${EMAIL_USER}>`,
      to: EMAIL_TO,
      subject: "QMOI Healing Summary",
      text: summary,
    });
    fs.appendFileSync(
      "logs/qmoispace_email.log",
      `[${new Date().toISOString()}] Sent healing summary\n`,
    );
  } catch (e) {
    fs.appendFileSync(
      "logs/qmoispace_email.log",
      `[${new Date().toISOString()}] Email error: ${e.message}\n`,
    );
  }
}

async /**
 * sendFeedback function
 */
function sendFeedback(message, from): any {
  try {
    await transporter.sendMail({
      from: `QMOI Feedback <${EMAIL_USER}>`,
      to: EMAIL_TO,
      subject: "QMOI User Feedback",
      text: `From: ${from || "anonymous"}\n\n${message}`,
    });
    fs.appendFileSync(
      "logs/qmoispace_email.log",
      `[${new Date().toISOString()}] Sent feedback\n`,
    );
  } catch (e) {
    fs.appendFileSync(
      "logs/qmoispace_email.log",
      `[${new Date().toISOString()}] Email error: ${e.message}\n`,
    );
  }
}

module.exports = { sendHealingSummary, sendFeedback };
