import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { WhatsAppService } from '../../src/services/WhatsAppService';

// Constants
const REQUESTS_FILE = path.resolve(process.cwd(), 'data', 'wallet_requests.json');
const LOGS_FILE = path.resolve(process.cwd(), 'data', 'wallet_logs.json');

// Initialize WhatsApp service
let whatsappService: WhatsAppService;
try {
  whatsappService = WhatsAppService.getInstance();
} catch (e) {
  console.error('Failed to initialize WhatsApp service:', e);
}

// Enhanced logging
function logAction(action: string, details: any) {
  try {
    const logs = fs.existsSync(LOGS_FILE) ? JSON.parse(fs.readFileSync(LOGS_FILE, 'utf-8')) : [];
    logs.push({
      timestamp: new Date().toISOString(),
      action,
      details,
    });
    fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2));
  } catch (e) {
    console.error('Failed to log action:', e);
  }
}

// Simulated wallet state (replace with DB or secure backend in production)
const wallet = {
  balance: 10000,
  currency: 'KES',
  transactions: [
    { date: '2025-06-01', type: 'deposit', amount: 5000, currency: 'KES', platform: 'Mpesa', status: 'completed' },
    { date: '2025-06-10', type: 'withdraw', amount: 2000, currency: 'KES', platform: 'Binance', status: 'completed' },
  ],
};

const MPESA_API_URL = 'https://api.safaricom.co.ke/mpesa';
const BINANCE_API_URL = 'https://api.binance.com';
const PESA_API_URL = 'https://api.pesapal.com';
const BITGET_API_URL = 'https://api.bitget.com';

function readWalletRequests() {
  try {
    if (!fs.existsSync(REQUESTS_FILE)) return [];
    const data = fs.readFileSync(REQUESTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function writeWalletRequests(requests: any[]) {
  fs.mkdirSync(path.dirname(REQUESTS_FILE), { recursive: true });
  fs.writeFileSync(REQUESTS_FILE, JSON.stringify(requests, null, 2));
}

async function processMpesa(amount: number, type: string) {
  // Basic Mpesa API integration
  try {
    const mpesaConfig = {
      consumerKey: process.env.MPESA_CONSUMER_KEY,
      consumerSecret: process.env.MPESA_CONSUMER_SECRET,
      passkey: process.env.MPESA_PASSKEY,
      businessShortCode: process.env.MPESA_BUSINESS_SHORTCODE,
      environment: process.env.NODE_ENV === 'production' ? 'live' : 'sandbox'
    };

    if (!mpesaConfig.consumerKey || !mpesaConfig.consumerSecret) {
      console.warn('Mpesa credentials not configured, using simulation');
      return { status: 'success', platform: 'Mpesa', amount, transactionId: `MPESA_${Date.now()}` };
    }

    // In a real implementation, you would:
    // 1. Get access token from Mpesa
    // 2. Initiate STK push for payment
    // 3. Handle callbacks
    // 4. Verify transaction status
    
    const transactionId = `MPESA_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    logAction('mpesa_transaction', {
      type,
      amount,
      transactionId,
      status: 'initiated'
    });

    return { 
      status: 'success', 
      platform: 'Mpesa', 
      amount, 
      transactionId,
      message: type === 'deposit' ? 'STK push sent to phone' : 'Withdrawal initiated'
    };
  } catch (error) {
    console.error('Mpesa processing error:', error);
    return { status: 'error', platform: 'Mpesa', amount, error: error.message };
  }
}

async function processBinance(amount: number, type: string) {
  // Basic Binance API integration
  try {
    const binanceConfig = {
      apiKey: process.env.BINANCE_API_KEY,
      secretKey: process.env.BINANCE_SECRET_KEY,
      testnet: process.env.NODE_ENV !== 'production'
    };

    if (!binanceConfig.apiKey || !binanceConfig.secretKey) {
      console.warn('Binance credentials not configured, using simulation');
      return { status: 'success', platform: 'Binance', amount, transactionId: `BINANCE_${Date.now()}` };
    }

    // In a real implementation, you would:
    // 1. Authenticate with Binance API
    // 2. Create deposit/withdrawal order
    // 3. Monitor transaction status
    // 4. Handle webhooks for status updates

    const transactionId = `BINANCE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    logAction('binance_transaction', {
      type,
      amount,
      transactionId,
      status: 'initiated'
    });

    return { 
      status: 'success', 
      platform: 'Binance', 
      amount, 
      transactionId,
      message: type === 'deposit' ? 'Deposit address generated' : 'Withdrawal order created'
    };
  } catch (error) {
    console.error('Binance processing error:', error);
    return { status: 'error', platform: 'Binance', amount, error: error.message };
  }
}

async function processPesapal(amount: number, type: string) {
  // Basic Pesapal API integration
  try {
    const pesapalConfig = {
      consumerKey: process.env.PESAPAL_CONSUMER_KEY,
      consumerSecret: process.env.PESAPAL_CONSUMER_SECRET,
      environment: process.env.NODE_ENV === 'production' ? 'live' : 'sandbox'
    };

    if (!pesapalConfig.consumerKey || !pesapalConfig.consumerSecret) {
      console.warn('Pesapal credentials not configured, using simulation');
      return { status: 'success', platform: 'Pesapal', amount, transactionId: `PESAPAL_${Date.now()}` };
    }

    // In a real implementation, you would:
    // 1. Authenticate with Pesapal
    // 2. Create payment request
    // 3. Redirect user to Pesapal payment page
    // 4. Handle IPN callbacks

    const transactionId = `PESAPAL_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    logAction('pesapal_transaction', {
      type,
      amount,
      transactionId,
      status: 'initiated'
    });

    return { 
      status: 'success', 
      platform: 'Pesapal', 
      amount, 
      transactionId,
      message: type === 'deposit' ? 'Payment request created' : 'Withdrawal initiated'
    };
  } catch (error) {
    console.error('Pesapal processing error:', error);
    return { status: 'error', platform: 'Pesapal', amount, error: error.message };
  }
}

async function processBitget(amount: number, type: string) {
  // Basic Bitget API integration
  try {
    const bitgetConfig = {
      apiKey: process.env.BITGET_API_KEY,
      secretKey: process.env.BITGET_SECRET_KEY,
      passphrase: process.env.BITGET_PASSPHRASE,
      testnet: process.env.NODE_ENV !== 'production'
    };

    if (!bitgetConfig.apiKey || !bitgetConfig.secretKey) {
      console.warn('Bitget credentials not configured, using simulation');
      return { status: 'success', platform: 'Bitget', amount, transactionId: `BITGET_${Date.now()}` };
    }

    // In a real implementation, you would:
    // 1. Authenticate with Bitget API
    // 2. Create deposit/withdrawal order
    // 3. Monitor transaction status
    // 4. Handle webhooks

    const transactionId = `BITGET_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    logAction('bitget_transaction', {
      type,
      amount,
      transactionId,
      status: 'initiated'
    });

    return { 
      status: 'success', 
      platform: 'Bitget', 
      amount, 
      transactionId,
      message: type === 'deposit' ? 'Deposit address generated' : 'Withdrawal order created'
    };
  } catch (error) {
    console.error('Bitget processing error:', error);
    return { status: 'error', platform: 'Bitget', amount, error: error.message };
  }
}

const platformHandlers: Record<string, any> = {
  Mpesa: processMpesa,
  Binance: processBinance,
  Pesapal: processPesapal,
  Bitget: processBitget,
  Cashon: async (amount: number, type: string) => ({ status: 'success', platform: 'Cashon', amount }),
};

// Helper: Check if user is master (simulate for now)
function isMaster(req: NextApiRequest): boolean {
  // In production, check session/user role from auth/session
  return req.headers['x-master-token'] === process.env.MASTER_TOKEN;
}

// Enhanced error handling wrapper
const handleApiRequest = async (req: NextApiRequest, res: NextApiResponse, handler: () => Promise<any>) => {
  try {
    const result = await handler();
    return res.json(result);
  } catch (error: any) {
    logAction('error', { error: error.message, path: req.url, method: req.method });
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const adminToken = req.headers['x-admin-token'];
  if (adminToken !== process.env.ADMIN_TOKEN) {
    logAction('unauthorized_access', { path: req.url, method: req.method });
    return res.status(403).json({ error: 'Forbidden' });
  }

  if (req.method === 'GET') {
    return handleApiRequest(req, res, async () => {
      if (req.query.pending_wallets) {
        const requests = readWalletRequests();
        return requests.filter(r => r.status === 'pending');
      }
      if (req.query.balance) {
        return wallet;
      }
      if (req.query.logs && isMaster(req)) {
        const logs = fs.existsSync(LOGS_FILE) ? JSON.parse(fs.readFileSync(LOGS_FILE, 'utf-8')) : [];
        return logs;
      }
      throw new Error('Unknown GET action');
    });
  }

  if (req.method === 'POST') {
    return handleApiRequest(req, res, async () => {
      const { amount, platform, action, email, username } = req.body;
      const handler = platformHandlers[platform] || platformHandlers['Cashon'];

      if (req.query.deposit) {
        if (!isMaster(req)) {
          logAction('unauthorized_deposit', { amount, platform });
          throw new Error('Only master can deposit funds.');
        }
        const result = await handler(Number(amount), 'deposit');
        wallet.balance += Number(amount);
        const transaction = { 
          date: new Date().toISOString().slice(0,10), 
          type: 'deposit', 
          amount, 
          currency: wallet.currency, 
          platform, 
          status: result.status 
        };
        wallet.transactions.push(transaction);
        logAction('deposit', transaction);
        await whatsappService.sendMessageToMaster(`💰 Deposit completed: ${amount} ${wallet.currency} via ${platform}`);
        return { status: result.status, balance: wallet.balance };
      }

      if (req.query.withdraw) {
        if (!isMaster(req)) {
          logAction('unauthorized_withdrawal', { amount, platform });
          throw new Error('Only master can withdraw funds.');
        }
        const result = await handler(Number(amount), 'withdraw');
        wallet.balance -= Number(amount);
        const transaction = { 
          date: new Date().toISOString().slice(0,10), 
          type: 'withdraw', 
          amount, 
          currency: wallet.currency, 
          platform, 
          status: result.status 
        };
        wallet.transactions.push(transaction);
        logAction('withdrawal', transaction);
        await whatsappService.sendMessageToMaster(`💸 Withdrawal completed: ${amount} ${wallet.currency} via ${platform}`);
        return { status: result.status, balance: wallet.balance };
      }

      if (action === 'request_wallet') {
        if (!email || !username) throw new Error('Missing email or username');
        const requests = readWalletRequests();
        if (requests.some(r => r.email === email && r.status === 'pending')) {
          throw new Error('A wallet request is already pending for this email');
        }
        const request = { 
          email, 
          username, 
          requestedAt: new Date().toISOString(), 
          status: 'pending' 
        };
        requests.push(request);
        writeWalletRequests(requests);
        logAction('wallet_request', request);
        await whatsappService.sendMessageToMaster(`👤 New wallet request from ${username} (${email})`);
        return { status: 'pending', message: 'Wallet request sent to master for approval.' };
      }

      if (action === 'approve_wallet') {
        if (!isMaster(req)) {
          logAction('unauthorized_wallet_approval', { email });
          throw new Error('Only master can approve wallet requests.');
        }
        const { email: approveEmail } = req.body;
        const requests = readWalletRequests();
        const idx = requests.findIndex(r => r.email === approveEmail && r.status === 'pending');
        if (idx === -1) throw new Error('No pending request for this email.');
        
        requests[idx].status = 'approved';
        requests[idx].approvedAt = new Date().toISOString();
        writeWalletRequests(requests);
        logAction('wallet_approved', requests[idx]);
        
        // Notify user via WhatsApp
        await whatsappService.sendMessage(requests[idx].email, '✅ Your wallet request has been approved!');
        await whatsappService.sendMessageToMaster(`✅ Wallet approved for ${requests[idx].username} (${approveEmail})`);
        
        return { status: 'approved', message: 'Wallet created and user notified.' };
      }

      throw new Error('Unknown POST action');
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
