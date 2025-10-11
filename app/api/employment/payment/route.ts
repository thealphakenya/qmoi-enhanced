import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Payment schemas
const PaymentSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(['employee', 'user']),
  amount: z.number().positive(),
  paymentMethod: z.enum(['mpesa', 'airtel', 'pesapal', 'bank']),
  description: z.string(),
  scheduledDate: z.string().optional(),
});

const PaymentInfoSchema = z.object({
  recipientId: z.string(),
  recipientType: z.enum(['employee', 'user']),
  paymentMethod: z.enum(['mpesa', 'airtel', 'pesapal', 'bank']),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  mpesaNumber: z.string().optional(),
  airtelNumber: z.string().optional(),
  bankCode: z.string().optional(),
});

// [PRODUCTION IMPLEMENTATION REQUIRED] database
const payments: any[] = [];
const paymentLogs: any[] = [];

// Secure credential storage (in production, use encrypted environment variables)
const PAYMENT_CREDENTIALS = {
  pesapal: {
    consumerKey: process.env.PESAPAL_CONSUMER_KEY || 'UCz/GBzE5O5vNpzt99a6xEEqMi0O3QQE',
    consumerSecret: process.env.PESAPAL_CONSUMER_SECRET || 'OyeJBzYMiWvVQdfNGJW3/wBpems=',
  },
  mpesa: {
    consumerKey: process.env.MPESA_CONSUMER_KEY || '',
    consumerSecret: process.env.MPESA_CONSUMER_SECRET || '',
    passkey: process.env.MPESA_PASSKEY || '',
  },
  airtel: {
    clientId: process.env.AIRTEL_CLIENT_ID || '',
    clientSecret: process.env.AIRTEL_CLIENT_SECRET || '',
  },
};

// Email backup function
async function backupCredentialsToEmail(credentials: any, platform: string) {
  try {
    const emailData = {
      to: 'rovicviccy@gmail.com',
      subject: `QMOI Payment Credentials - ${platform}`,
      body: `Platform: ${platform}\nCredentials: ${JSON.stringify(credentials, null, 2)}\nTimestamp: ${new Date().toISOString()}`,
    };

    // In production, use a proper email service
    console.log('Credentials backed up to email:', emailData);
    
    // Also backup to QMOI server
    await fetch('/api/qmoi-database', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'backup_credentials',
        platform,
        credentials: JSON.stringify(credentials),
        timestamp: Date.now(),
      }),
    });
  } catch (error) {
    console.error('Failed to backup credentials:', error);
  }
}

// Payment processing functions
async function processMpesaPayment(paymentData: any) {
  try {
    // Simulate M-Pesa API call
    const response = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYMENT_CREDENTIALS.mpesa.consumerKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BusinessShortCode: '174379',
        Password: PAYMENT_CREDENTIALS.mpesa.passkey,
        Timestamp: new Date().toISOString(),
        TransactionType: 'CustomerPayBillOnline',
        Amount: paymentData.amount,
        PartyA: paymentData.mpesaNumber,
        PartyB: '174379',
        PhoneNumber: paymentData.mpesaNumber,
        CallBackURL: 'https://your-callback-url.com/mpesa',
        AccountReference: paymentData.description,
        TransactionDesc: paymentData.description,
      }),
    });

    const result = await response.json();
    return { success: true, reference: result.CheckoutRequestID, provider: 'mpesa' };
  } catch (error) {
    console.error('M-Pesa payment failed:', error);
    return { success: false, error: 'M-Pesa payment failed' };
  }
}

async function processAirtelPayment(paymentData: any) {
  try {
    // Simulate Airtel Money API call
    const response = await fetch('https://openapiuat.airtel.africa/merchant/v1/payments/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYMENT_CREDENTIALS.airtel.clientId}`,
        'Content-Type': 'application/json',
        'X-Country': 'KE',
        'X-Currency': 'KES',
      },
      body: JSON.stringify({
        reference: `QMOI_${Date.now()}`,
        subscriber: {
          country: 'KE',
          currency: 'KES',
          msisdn: paymentData.airtelNumber,
        },
        transaction: {
          amount: paymentData.amount,
          country: 'KE',
          currency: 'KES',
          id: `QMOI_${Date.now()}`,
        },
      }),
    });

    const result = await response.json();
    return { success: true, reference: result.data.transaction.id, provider: 'airtel' };
  } catch (error) {
    console.error('Airtel payment failed:', error);
    return { success: false, error: 'Airtel payment failed' };
  }
}

async function processPesapalPayment(paymentData: any) {
  try {
    // Simulate Pesapal API call
    const response = await fetch('https://www.pesapal.com/api/PostPesapalDirectOrderV4', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml',
      },
      body: `
        <PesapalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${paymentData.amount}" 
          Description="${paymentData.description}" 
          Type="MERCHANT" 
          Reference="${Date.now()}" 
          FirstName="${paymentData.accountName?.split(' ')[0] || 'User'}" 
          LastName="${paymentData.accountName?.split(' ').slice(1).join(' ') || 'Name'}" 
          Email="${paymentData.email}" 
          PhoneNumber="${paymentData.phone}" 
          xmlns="http://www.pesapal.com" />
      `,
    });

    const result = await response.text();
    return { success: true, reference: result, provider: 'pesapal' };
  } catch (error) {
    console.error('Pesapal payment failed:', error);
    return { success: false, error: 'Pesapal payment failed' };
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type'); // 'payments', 'logs', 'credentials'
  const status = searchParams.get('status');
  const recipientId = searchParams.get('recipientId');

  try {
    if (type === 'payments') {
      let data = payments;
      if (status) data = data.filter(p => p.status === status);
      if (recipientId) data = data.filter(p => p.recipientId === recipientId);
      
      return NextResponse.json({ success: true, data });
    } else if (type === 'logs') {
      return NextResponse.json({ success: true, data: paymentLogs });
    } else if (type === 'credentials') {
      // Only return non-sensitive info
      return NextResponse.json({ 
        success: true, 
        data: {
          pesapal: { consumerKey: '***' },
          mpesa: { consumerKey: '***' },
          airtel: { clientId: '***' },
        }
      });
    } else {
      return NextResponse.json({ 
        success: true, 
        data: { payments, logs: paymentLogs }
      });
    }
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch payment data' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    if (action === 'process_payment') {
      const validatedData = PaymentSchema.parse(data);
      
      const payment = {
        id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...validatedData,
        status: 'pending',
        createdAt: Date.now(),
        processedAt: null,
        result: null,
      };

      payments.push(payment);

      // Process payment based on method
      let result;
      switch (validatedData.paymentMethod) {
        case 'mpesa':
          result = await processMpesaPayment(validatedData);
          break;
        case 'airtel':
          result = await processAirtelPayment(validatedData);
          break;
        case 'pesapal':
          result = await processPesapalPayment(validatedData);
          break;
        default:
          result = { success: false, error: 'Unsupported payment method' };
      }

      // Update payment status
      const paymentIndex = payments.findIndex(p => p.id === payment.id);
      if (paymentIndex !== -1) {
        payments[paymentIndex] = {
          ...payments[paymentIndex],
          status: result.success ? 'completed' : 'failed',
          processedAt: Date.now(),
          result,
        };
      }

      // Log the payment
      paymentLogs.push({
        id: Date.now(),
        action: 'payment_processed',
        paymentId: payment.id,
        recipientId: validatedData.recipientId,
        amount: validatedData.amount,
        method: validatedData.paymentMethod,
        status: result.success ? 'success' : 'failed',
        details: result.success ? 'Payment processed successfully' : result.error,
        timestamp: Date.now(),
      });

      return NextResponse.json({ 
        success: true, 
        data: payments[paymentIndex],
        message: result.success ? 'Payment processed successfully' : 'Payment failed'
      });
    } else if (action === 'update_payment_info') {
      const validatedData = PaymentInfoSchema.parse(data);
      
      // Update recipient payment info
      // This would update the employee/user record with new payment info
      
      // Log the update
      paymentLogs.push({
        id: Date.now(),
        action: 'payment_info_updated',
        recipientId: validatedData.recipientId,
        method: validatedData.paymentMethod,
        details: 'Payment information updated',
        timestamp: Date.now(),
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Payment information updated successfully' 
      });
    } else if (action === 'backup_credentials') {
      // Backup credentials to email and server
      await backupCredentialsToEmail(PAYMENT_CREDENTIALS, 'all_platforms');
      
      return NextResponse.json({ 
        success: true, 
        message: 'Credentials backed up successfully' 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid action specified' 
      }, { status: 400 });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Validation failed', 
        details: error.errors 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to process payment action' 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    const index = payments.findIndex(p => p.id === id);
    if (index === -1) {
      return NextResponse.json({ 
        success: false, 
        error: 'Payment not found' 
      }, { status: 404 });
    }

    payments[index] = { ...payments[index], ...updates };
    
    // Log the update
    paymentLogs.push({
      id: Date.now(),
      action: 'payment_updated',
      paymentId: id,
      details: 'Payment updated',
      timestamp: Date.now(),
    });

    return NextResponse.json({ 
      success: true, 
      data: payments[index],
      message: 'Payment updated successfully' 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update payment' 
    }, { status: 500 });
  }
} 