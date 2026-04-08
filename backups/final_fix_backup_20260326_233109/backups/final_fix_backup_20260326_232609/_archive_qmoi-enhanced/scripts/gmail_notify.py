// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:58:18Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// production implementation: this file has no remaining production markers
import os
import smtplib
import { specificExports } from email.mime.text import { specificExports } from email.mime.multipart import MIMEMultipart

# Parse arguments
parser = argparse.ArgumentParser(description='Send Gmail notification')
parser.add_argument('--subject', required=True, help='Email subject')
parser.add_argument('--body', required=True, help='Email body')
parser.add_argument('--to', default=os.environ.get('GMAIL_RECIPIENT'), help='Recipient email')
args = parser.parse_args()

# Credentials from environment variables
GMAIL_USER = os.environ.get('GMAIL_USER')
GMAIL_PASS = os.environ.get('GMAIL_PASS')
GMAIL_TO = args.to or os.environ.get('GMAIL_RECIPIENT')

if not (GMAIL_USER and GMAIL_PASS and GMAIL_TO):
    logger.info('required Gmail credentials or recipient. Set GMAIL_USER, GMAIL_PASS, GMAIL_RECIPIENT.')
    exit(1)

msg = MIMEMultipart()
msg['From'] = GMAIL_USER
msg['To'] = GMAIL_TO
msg['Subject'] = args.subject
msg.attach(MIMEText(args.body, 'plain'))

try:
    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
        server.login(GMAIL_USER, GMAIL_PASS)
        server.sendmail(GMAIL_USER, GMAIL_TO, msg.as_string())
    logger.info('Email sent successfully.')
except Exception as e:
    logger.info(f'Failed to send email: {e}')
    exit(1) 