import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';

const transactions = [
  { id: 'txn1', type: 'airtel', amount: 1000, status: 'pending' },
  { id: 'txn2', type: 'mpesa', amount: 500, status: 'approved' },
];

export async function GET() {
  // In real use, fetch from DB or API
  return NextResponse.json({ success: true, transactions });
}

export async function POST(req: NextRequest) {
  const { id, action } = await req.json();
  // In real use, update DB or call API
  const log = `Transaction ${id} ${action} by master at ${new Date().toISOString()}`;
  fs.appendFileSync('logs/financial_verification.log', log + '\n');
  return NextResponse.json({ success: true, message: log });
} 