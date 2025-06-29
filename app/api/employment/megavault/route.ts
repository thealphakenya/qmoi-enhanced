import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Megavault schemas
const FundAllocationSchema = z.object({
  amount: z.number().positive(),
  purpose: z.string(),
  targetAccount: z.string(),
  description: z.string(),
});

const ProfitCalculationSchema = z.object({
  period: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'yearly']),
  startDate: z.string(),
  endDate: z.string(),
});

const DividendDistributionSchema = z.object({
  percentage: z.number().min(0).max(100),
  recipients: z.array(z.object({
    id: z.string(),
    type: z.enum(['employee', 'user']),
    percentage: z.number().min(0).max(100),
  })),
});

// Mock database
let megavaultData = {
  currentBalance: 1000000, // 1M starting balance
  totalInflow: 1500000,
  totalOutflow: 500000,
  totalProfit: 2000000,
  totalDividends: 300000,
  transactions: [] as any[],
  profitHistory: [] as any[],
  dividendHistory: [] as any[],
};

// Pesapal integration credentials
const PESAPAL_CREDENTIALS = {
  consumerKey: process.env.PESAPAL_CONSUMER_KEY || 'UCz/GBzE5O5vNpzt99a6xEEqMi0O3QQE',
  consumerSecret: process.env.PESAPAL_CONSUMER_SECRET || 'OyeJBzYMiWvVQdfNGJW3/wBpems=',
  environment: process.env.PESAPAL_ENVIRONMENT || 'sandbox',
};

// Email backup function for credentials
async function backupCredentialsToEmail(credentials: any, platform: string) {
  try {
    const emailData = {
      to: 'rovicviccy@gmail.com',
      subject: `QMOI Megavault Credentials - ${platform}`,
      body: `Platform: ${platform}\nCredentials: ${JSON.stringify(credentials, null, 2)}\nTimestamp: ${new Date().toISOString()}`,
    };

    console.log('Megavault credentials backed up to email:', emailData);
    
    // Backup to QMOI server
    await fetch('/api/qmoi-database', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'backup_megavault_credentials',
        platform,
        credentials: JSON.stringify(credentials),
        timestamp: Date.now(),
      }),
    });
  } catch (error) {
    console.error('Failed to backup megavault credentials:', error);
  }
}

// Pesapal integration functions
async function initializePesapalAccount() {
  try {
    // Simulate Pesapal account creation
    const accountData = {
      accountId: `qmoi_megavault_${Date.now()}`,
      accountName: 'QMOI Megavault',
      currency: 'KES',
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    // Backup credentials
    await backupCredentialsToEmail(PESAPAL_CREDENTIALS, 'pesapal');

    return { success: true, account: accountData };
  } catch (error) {
    console.error('Failed to initialize Pesapal account:', error);
    return { success: false, error: 'Pesapal initialization failed' };
  }
}

async function processPesapalTransaction(transactionData: any) {
  try {
    // Simulate Pesapal transaction
    const response = await fetch('https://www.pesapal.com/api/PostPesapalDirectOrderV4', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml',
        'Authorization': `Bearer ${PESAPAL_CREDENTIALS.consumerKey}`,
      },
      body: `
        <PesapalDirectOrderInfo 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
          xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
          Amount="${transactionData.amount}" 
          Description="${transactionData.description}" 
          Type="MERCHANT" 
          Reference="${transactionData.reference}" 
          FirstName="QMOI" 
          LastName="Megavault" 
          Email="qmoialpha@gmail.com" 
          PhoneNumber="254700000000" 
          xmlns="http://www.pesapal.com" />
      `,
    });

    const result = await response.text();
    return { success: true, transactionId: result, provider: 'pesapal' };
  } catch (error) {
    console.error('Pesapal transaction failed:', error);
    return { success: false, error: 'Pesapal transaction failed' };
  }
}

// Profit calculation functions
function calculateProfit(period: string, startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Filter transactions within period
  const periodTransactions = megavaultData.transactions.filter(t => {
    const txDate = new Date(t.timestamp);
    return txDate >= start && txDate <= end;
  });

  const inflow = periodTransactions
    .filter(t => t.type === 'inflow')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const outflow = periodTransactions
    .filter(t => t.type === 'outflow')
    .reduce((sum, t) => sum + t.amount, 0);

  const profit = inflow - outflow;
  
  return {
    period,
    startDate,
    endDate,
    inflow,
    outflow,
    profit,
    transactionCount: periodTransactions.length,
  };
}

// Dividend distribution functions
async function distributeDividends(distributionData: any) {
  try {
    const { percentage, recipients } = distributionData;
    const totalAmount = megavaultData.currentBalance * (percentage / 100);
    
    const distributions = recipients.map((recipient: any) => {
      const amount = totalAmount * (recipient.percentage / 100);
      return {
        recipientId: recipient.id,
        recipientType: recipient.type,
        amount,
        percentage: recipient.percentage,
        timestamp: Date.now(),
      };
    });

    // Update megavault balance
    megavaultData.currentBalance -= totalAmount;
    megavaultData.totalOutflow += totalAmount;
    megavaultData.totalDividends += totalAmount;

    // Log distributions
    distributions.forEach(dist => {
      megavaultData.dividendHistory.push({
        id: `div_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...dist,
        status: 'completed',
      });
    });

    // Log transaction
    megavaultData.transactions.push({
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'outflow',
      amount: totalAmount,
      description: `Dividend distribution (${percentage}%)`,
      timestamp: Date.now(),
      category: 'dividend',
    });

    return { success: true, distributions, totalAmount };
  } catch (error) {
    console.error('Dividend distribution failed:', error);
    return { success: false, error: 'Dividend distribution failed' };
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type'); // 'balance', 'transactions', 'profit', 'dividends'
  const period = searchParams.get('period');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  try {
    switch (type) {
      case 'balance':
        return NextResponse.json({
          success: true,
          data: {
            currentBalance: megavaultData.currentBalance,
            totalInflow: megavaultData.totalInflow,
            totalOutflow: megavaultData.totalOutflow,
            totalProfit: megavaultData.totalProfit,
            totalDividends: megavaultData.totalDividends,
          }
        });

      case 'transactions':
        let transactions = megavaultData.transactions;
        if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          transactions = transactions.filter(t => {
            const txDate = new Date(t.timestamp);
            return txDate >= start && txDate <= end;
          });
        }
        return NextResponse.json({ success: true, data: transactions });

      case 'profit':
        if (period && startDate && endDate) {
          const profitData = calculateProfit(period, startDate, endDate);
          return NextResponse.json({ success: true, data: profitData });
        }
        return NextResponse.json({ success: true, data: megavaultData.profitHistory });

      case 'dividends':
        return NextResponse.json({ success: true, data: megavaultData.dividendHistory });

      case 'credentials':
        return NextResponse.json({
          success: true,
          data: {
            pesapal: { consumerKey: '***', environment: PESAPAL_CREDENTIALS.environment },
          }
        });

      default:
        return NextResponse.json({
          success: true,
          data: megavaultData
        });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch megavault data'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'allocate_funds':
        const allocationData = FundAllocationSchema.parse(data);
        
        if (allocationData.amount > megavaultData.currentBalance) {
          return NextResponse.json({
            success: false,
            error: 'Insufficient funds in Megavault'
          }, { status: 400 });
        }

        // Update balance
        megavaultData.currentBalance -= allocationData.amount;
        megavaultData.totalOutflow += allocationData.amount;

        // Log transaction
        const transaction = {
          id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'outflow',
          amount: allocationData.amount,
          description: allocationData.description,
          purpose: allocationData.purpose,
          targetAccount: allocationData.targetAccount,
          timestamp: Date.now(),
          category: 'allocation',
        };

        megavaultData.transactions.push(transaction);

        return NextResponse.json({
          success: true,
          data: transaction,
          message: 'Funds allocated successfully'
        });

      case 'calculate_profit':
        const profitData = ProfitCalculationSchema.parse(data);
        const profitResult = calculateProfit(
          profitData.period,
          profitData.startDate,
          profitData.endDate
        );

        megavaultData.profitHistory.push({
          id: `profit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          ...profitResult,
          calculatedAt: Date.now(),
        });

        return NextResponse.json({
          success: true,
          data: profitResult,
          message: 'Profit calculated successfully'
        });

      case 'distribute_dividends':
        const dividendData = DividendDistributionSchema.parse(data);
        const dividendResult = await distributeDividends(dividendData);

        if (!dividendResult.success) {
          return NextResponse.json({
            success: false,
            error: dividendResult.error
          }, { status: 500 });
        }

        return NextResponse.json({
          success: true,
          data: dividendResult,
          message: 'Dividends distributed successfully'
        });

      case 'initialize_pesapal':
        const pesapalResult = await initializePesapalAccount();
        
        if (!pesapalResult.success) {
          return NextResponse.json({
            success: false,
            error: pesapalResult.error
          }, { status: 500 });
        }

        return NextResponse.json({
          success: true,
          data: pesapalResult.account,
          message: 'Pesapal account initialized successfully'
        });

      case 'add_inflow':
        const { amount, description, source } = data;
        
        megavaultData.currentBalance += amount;
        megavaultData.totalInflow += amount;
        megavaultData.totalProfit += amount;

        const inflowTransaction = {
          id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'inflow',
          amount,
          description,
          source,
          timestamp: Date.now(),
          category: 'revenue',
        };

        megavaultData.transactions.push(inflowTransaction);

        return NextResponse.json({
          success: true,
          data: inflowTransaction,
          message: 'Inflow recorded successfully'
        });

      default:
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
      error: 'Failed to process megavault action'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    // Find and update transaction
    const transactionIndex = megavaultData.transactions.findIndex(t => t.id === id);
    if (transactionIndex === -1) {
      return NextResponse.json({
        success: false,
        error: 'Transaction not found'
      }, { status: 404 });
    }

    megavaultData.transactions[transactionIndex] = {
      ...megavaultData.transactions[transactionIndex],
      ...updates,
      updatedAt: Date.now(),
    };

    return NextResponse.json({
      success: true,
      data: megavaultData.transactions[transactionIndex],
      message: 'Transaction updated successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to update transaction'
    }, { status: 500 });
  }
} 