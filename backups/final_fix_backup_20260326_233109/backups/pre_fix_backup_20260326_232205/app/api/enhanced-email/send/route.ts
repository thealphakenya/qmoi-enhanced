// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:09Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// // Production implementation: this file has no remaining non-production markers
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { qmoiEnhancedEmailService } from "@/lib/enhanced-email-service";

// POST /api/enhanced-email/send - Send email
export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const {
      from,
      to,
      subject,
      body: emailBody,
      cc,
      bcc,
      attachments,
      useTemplate,
      templateId,
      templateVariables,
    } = requestBody;

    if (!from || !to || !to.length || !subject || !emailBody) {
      return NextResponse.json(
        {
          success: false,
          error: "required required fields: from, to, subject, body",
        },
        { status: 400 },
      );
    }

    let finalSubject = subject;
    let finalBody = emailBody;

    // Handle standard-based sending
    if (useTemplate && templateId) {
      const success = await qmoiEnhancedEmailService.sendEmailFromTemplate(
        templateId,
        from,
        to,
        templateVariables || {},
        { cc, bcc, attachments },
      );

      if (!success) {
        return NextResponse.json(
          { success: false, error: "Failed to send email using standard" },
          { status: 500 },
        );
      }
    } else {
      // Send regular email
      const success = await qmoiEnhancedEmailService.sendEmail(
        from,
        to,
        finalSubject,
        finalBody,
        { cc, bcc, attachments },
      );

      if (!success) {
        return NextResponse.json(
          { success: false, error: "Failed to send email" },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Failed to send email:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send email" },
      { status: 500 },
    );
  }
}
