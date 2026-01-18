/**
 * Email Service
 * Production email sending with templating support
 */

import nodemailer from "nodemailer";

interface EmailOptions {
  to: string | string[];
  subject: string;
  body?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    content: string;
  }>;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  /**
   * Initialize email transporter
   */
  private getTransporter = (): nodemailer.Transporter => {
    if (this.transporter) return this.transporter;

    if (process.env.EMAIL_PROVIDER === "sendgrid") {
      this.transporter = nodemailer.createTransport({
        host: "smtp.sendgrid.net",
        port: 587,
        auth: {
          user: "apikey",
          pass: process.env.SENDGRID_API_KEY || "",
        },
      });
    } else if (process.env.EMAIL_PROVIDER === "aws-ses") {
      // AWS SES configuration
      this.transporter = nodemailer.createTransport({
        host: `email-smtp.${process.env.AWS_REGION}.amazonaws.com`,
        port: 587,
        auth: {
          user: process.env.AWS_SES_USER,
          pass: process.env.AWS_SES_PASSWORD,
        },
      });
    } else {
      // Default SMTP
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "localhost",
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: process.env.SMTP_USER
          ? {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASSWORD,
            }
          : undefined,
      });
    }

    return this.transporter;
  };

  /**
   * Send email
   */
  sendEmail = async (options: EmailOptions): Promise<boolean> => {
    try {
      const transporter = this.getTransporter();
      const result = await transporter.sendMail({
        from: process.env.EMAIL_FROM || "noreply@qmoi.app",
        to: Array.isArray(options.to) ? options.to.join(",") : options.to,
        subject: options.subject,
        text: options.body,
        html: options.html || options.body,
        attachments: options.attachments,
      });

      console.log(`Email sent to ${options.to}:`, result.messageId);
      return true;
    } catch (error) {
      console.error("Failed to send email:", error);
      return false;
    }
  };

  /**
   * Send verification email
   */
  sendVerificationEmail = async (
    email: string,
    code: string,
  ): Promise<boolean> => {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Email Verification</h2>
        <p>Thank you for signing up! Please verify your email address using the code below:</p>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0;">
          <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px;">${code}</p>
        </div>
        <p>This code will expire in 1 hour.</p>
        <p>If you didn't create this account, please ignore this email.</p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: "Email Verification - QMOI Enhanced",
      html,
    });
  };

  /**
   * Send password reset email
   */
  sendPasswordReset = async (
    email: string,
    resetToken: string,
  ): Promise<boolean> => {
    const resetUrl = `${process.env.APP_URL}/reset-password?token=${resetToken}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>We received a request to reset your password. Click the link below to proceed:</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${resetUrl}" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't request this reset, please ignore this email.</p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: "Password Reset - QMOI Enhanced",
      html,
    });
  };

  /**
   * Send notification email
   */
  sendNotification = async (
    email: string,
    subject: string,
    message: string,
  ): Promise<boolean> => {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>${subject}</h2>
        <p>${message}</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="font-size: 12px; color: #666;">
          © 2026 QMOI Enhanced. All rights reserved.
        </p>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject,
      html,
    });
  };
}

export const emailService = new EmailService();

export default emailService;
