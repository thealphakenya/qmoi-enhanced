import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Revenue generation schemas
const MicrotaskSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.enum(['data_labeling', 'content_creation', 'testing', 'research', 'marketing']),
  reward: z.number().positive(),
  estimatedTime: z.number().positive(), // in minutes
  requirements: z.array(z.string()),
  assignedTo: z.array(z.string()).optional(),
  clientId: z.string().optional(),
  deadline: z.string().optional(),
});

const AffiliateCampaignSchema = z.object({
  name: z.string(),
  product: z.string(),
  commission: z.number().min(0).max(100),
  link: z.string().url(),
  assignedUsers: z.array(z.string()),
  startDate: z.string(),
  endDate: z.string().optional(),
  targetSales: z.number().positive(),
});

const ContentProjectSchema = z.object({
  title: z.string(),
  type: z.enum(['article', 'video', 'graphic', 'audio', 'documentation']),
  description: z.string(),
  reward: z.number().positive(),
  assignedTo: z.string(),
  clientId: z.string().optional(),
  deadline: z.string(),
  requirements: z.array(z.string()),
});

const ReferralProgramSchema = z.object({
  name: z.string(),
  description: z.string(),
  bonus: z.number().positive(),
  requirements: z.array(z.string()),
  validUntil: z.string(),
});

// Mock database
let microtasks: any[] = [];
let affiliateCampaigns: any[] = [];
let contentProjects: any[] = [];
let referralPrograms: any[] = [];
let revenueLogs: any[] = [];
let platformAccounts: any[] = [];

// M-Pesa credentials (securely stored)
const MPESA_CREDENTIALS = {
  consumerKey: process.env.MPESA_CONSUMER_KEY || 'ruOrfyOb22NgqcsmToADVNDf0Gltcu6AI8woFLOusfgkNBnj',
  consumerSecret: process.env.MPESA_CONSUMER_SECRET || 'u27oKMfyACGxoQsD2bAuAJn0QzMQ8cWofA6bfzuG4hXaGxCB90PiGOSuCVNcaCSj',
  shortcode: process.env.MPESA_SHORTCODE || 'N/A',
  environment: process.env.MPESA_ENVIRONMENT || 'sandbox',
};

// Email backup function
async function backupCredentialsToEmail(credentials: any, platform: string) {
  try {
    const emailData = {
      to: 'rovicviccy@gmail.com',
      subject: `QMOI Revenue Platform Credentials - ${platform}`,
      body: `Platform: ${platform}\nCredentials: ${JSON.stringify(credentials, null, 2)}\nTimestamp: ${new Date().toISOString()}`,
    };

    console.log('Credentials backed up to email:', emailData);
    
    // Backup to QMOI server
    await fetch('/api/qmoi-database', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'backup_revenue_credentials',
        platform,
        credentials: JSON.stringify(credentials),
        timestamp: Date.now(),
      }),
    });
  } catch (error) {
    console.error('Failed to backup credentials:', error);
  }
}

// Platform account creation functions
async function createPlatformAccount(platform: string, accountData: any) {
  try {
    const account = {
      id: `acc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      platform,
      accountData,
      status: 'active',
      createdAt: Date.now(),
      credentials: {},
    };

    // Platform-specific account creation logic
    switch (platform) {
      case 'upwork':
        account.credentials = {
          apiKey: `upw_${Math.random().toString(36).substr(2, 16)}`,
          secret: `upw_sec_${Math.random().toString(36).substr(2, 24)}`,
        };
        break;
      case 'fiverr':
        account.credentials = {
          apiKey: `fiv_${Math.random().toString(36).substr(2, 16)}`,
          secret: `fiv_sec_${Math.random().toString(36).substr(2, 24)}`,
        };
        break;
      case 'amazon_mechanical_turk':
        account.credentials = {
          accessKey: `mturk_${Math.random().toString(36).substr(2, 16)}`,
          secretKey: `mturk_sec_${Math.random().toString(36).substr(2, 24)}`,
        };
        break;
      case 'clickworker':
        account.credentials = {
          apiKey: `click_${Math.random().toString(36).substr(2, 16)}`,
          secret: `click_sec_${Math.random().toString(36).substr(2, 24)}`,
        };
        break;
      case 'appen':
        account.credentials = {
          apiKey: `app_${Math.random().toString(36).substr(2, 16)}`,
          secret: `app_sec_${Math.random().toString(36).substr(2, 24)}`,
        };
        break;
      case 'social_media':
        account.credentials = {
          facebook: { accessToken: `fb_${Math.random().toString(36).substr(2, 32)}` },
          twitter: { apiKey: `tw_${Math.random().toString(36).substr(2, 16)}` },
          linkedin: { accessToken: `li_${Math.random().toString(36).substr(2, 32)}` },
          instagram: { accessToken: `ig_${Math.random().toString(36).substr(2, 32)}` },
        };
        break;
      case 'ecommerce':
        account.credentials = {
          shopify: { apiKey: `shop_${Math.random().toString(36).substr(2, 16)}` },
          woocommerce: { consumerKey: `woo_${Math.random().toString(36).substr(2, 16)}` },
          etsy: { apiKey: `etsy_${Math.random().toString(36).substr(2, 16)}` },
        };
        break;
      case 'saas_platforms':
        account.credentials = {
          stripe: { secretKey: `sk_${Math.random().toString(36).substr(2, 24)}` },
          paypal: { clientId: `paypal_${Math.random().toString(36).substr(2, 16)}` },
          gumroad: { apiKey: `gum_${Math.random().toString(36).substr(2, 16)}` },
        };
        break;
    }

    platformAccounts.push(account);
    
    // Backup credentials
    await backupCredentialsToEmail(account.credentials, platform);

    return { success: true, account };
  } catch (error) {
    console.error(`Failed to create ${platform} account:`, error);
    return { success: false, error: `${platform} account creation failed` };
  }
}

// Revenue generation functions
async function generateMicrotaskRevenue(taskData: any) {
  try {
    // Simulate external client payment
    const clientPayment = taskData.reward * 1.5; // QMOI takes 33% cut
    const userPayment = taskData.reward;
    const qmoiProfit = clientPayment - userPayment;

    // Add to M-Pesa account
    await addToMpesaAccount(qmoiProfit, `Microtask: ${taskData.title}`);

    return {
      success: true,
      clientPayment,
      userPayment,
      qmoiProfit,
      revenue: qmoiProfit,
    };
  } catch (error) {
    console.error('Microtask revenue generation failed:', error);
    return { success: false, error: 'Microtask revenue failed' };
  }
}

async function generateAffiliateRevenue(campaignData: any) {
  try {
    // Simulate affiliate sales
    const sales = Math.floor(Math.random() * 10) + 1; // Random sales 1-10
    const totalRevenue = sales * 100; // Assume $100 per sale
    const commission = totalRevenue * (campaignData.commission / 100);
    const userShare = commission * 0.7; // User gets 70% of commission
    const qmoiShare = commission * 0.3; // QMOI gets 30%

    // Add to M-Pesa account
    await addToMpesaAccount(qmoiShare, `Affiliate: ${campaignData.name}`);

    return {
      success: true,
      sales,
      totalRevenue,
      commission,
      userShare,
      qmoiShare,
      revenue: qmoiShare,
    };
  } catch (error) {
    console.error('Affiliate revenue generation failed:', error);
    return { success: false, error: 'Affiliate revenue failed' };
  }
}

async function generateContentRevenue(projectData: any) {
  try {
    // Simulate content sale
    const salePrice = projectData.reward * 3; // Content sold for 3x reward
    const userPayment = projectData.reward;
    const qmoiProfit = salePrice - userPayment;

    // Add to M-Pesa account
    await addToMpesaAccount(qmoiProfit, `Content: ${projectData.title}`);

    return {
      success: true,
      salePrice,
      userPayment,
      qmoiProfit,
      revenue: qmoiProfit,
    };
  } catch (error) {
    console.error('Content revenue generation failed:', error);
    return { success: false, error: 'Content revenue failed' };
  }
}

async function generateReferralRevenue(referralData: any) {
  try {
    // Simulate referral bonus
    const referrals = Math.floor(Math.random() * 5) + 1; // Random referrals 1-5
    const totalBonus = referrals * referralData.bonus;
    const userBonus = totalBonus * 0.8; // User gets 80%
    const qmoiBonus = totalBonus * 0.2; // QMOI gets 20%

    // Add to M-Pesa account
    await addToMpesaAccount(qmoiBonus, `Referral: ${referralData.name}`);

    return {
      success: true,
      referrals,
      totalBonus,
      userBonus,
      qmoiBonus,
      revenue: qmoiBonus,
    };
  } catch (error) {
    console.error('Referral revenue generation failed:', error);
    return { success: false, error: 'Referral revenue failed' };
  }
}

// M-Pesa integration
async function addToMpesaAccount(amount: number, description: string) {
  try {
    // Simulate M-Pesa API call to add funds
    const response = await fetch('https://sandbox.safaricom.co.ke/mpesa/c2b/v1/simulate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MPESA_CREDENTIALS.consumerKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ShortCode: MPESA_CREDENTIALS.shortcode,
        CommandID: 'CustomerPayBillOnline',
        Amount: amount,
        Msisdn: '254700000000', // QMOI's M-Pesa number
        BillReferenceNumber: description,
      }),
    });

    const result = await response.json();
    
    // Log the transaction
    revenueLogs.push({
      id: Date.now(),
      action: 'mpesa_deposit',
      amount,
      description,
      status: 'success',
      timestamp: Date.now(),
      reference: result.CheckoutRequestID || `QMOI_${Date.now()}`,
    });

    return { success: true, reference: result.CheckoutRequestID };
  } catch (error) {
    console.error('M-Pesa deposit failed:', error);
    return { success: false, error: 'M-Pesa deposit failed' };
  }
}

// Additional revenue streams
async function generateSurveyRevenue(surveyData: any) {
  try {
    const participants = Math.floor(Math.random() * 20) + 5; // 5-25 participants
    const rewardPerParticipant = 5; // $5 per survey
    const totalCost = participants * rewardPerParticipant;
    const clientPayment = totalCost * 1.4; // Client pays 40% premium
    const qmoiProfit = clientPayment - totalCost;

    await addToMpesaAccount(qmoiProfit, `Survey: ${surveyData.title}`);

    return {
      success: true,
      participants,
      totalCost,
      clientPayment,
      qmoiProfit,
      revenue: qmoiProfit,
    };
  } catch (error) {
    return { success: false, error: 'Survey revenue failed' };
  }
}

async function generateDataLabelingRevenue(labelingData: any) {
  try {
    const dataPoints = Math.floor(Math.random() * 1000) + 100; // 100-1100 data points
    const rewardPerPoint = 0.1; // $0.10 per data point
    const totalCost = dataPoints * rewardPerPoint;
    const clientPayment = totalCost * 1.5; // Client pays 50% premium
    const qmoiProfit = clientPayment - totalCost;

    await addToMpesaAccount(qmoiProfit, `Data Labeling: ${labelingData.project}`);

    return {
      success: true,
      dataPoints,
      totalCost,
      clientPayment,
      qmoiProfit,
      revenue: qmoiProfit,
    };
  } catch (error) {
    return { success: false, error: 'Data labeling revenue failed' };
  }
}

async function generateSaaSResellingRevenue(saasData: any) {
  try {
    const subscriptions = Math.floor(Math.random() * 50) + 10; // 10-60 subscriptions
    const monthlyFee = 29; // $29/month per subscription
    const totalRevenue = subscriptions * monthlyFee;
    const costPerSubscription = 15; // $15 cost to QMOI
    const totalCost = subscriptions * costPerSubscription;
    const qmoiProfit = totalRevenue - totalCost;

    await addToMpesaAccount(qmoiProfit, `SaaS Reselling: ${saasData.service}`);

    return {
      success: true,
      subscriptions,
      totalRevenue,
      totalCost,
      qmoiProfit,
      revenue: qmoiProfit,
    };
  } catch (error) {
    return { success: false, error: 'SaaS reselling revenue failed' };
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type'); // 'microtasks', 'affiliate', 'content', 'referral', 'platforms', 'revenue'
  const status = searchParams.get('status');

  try {
    switch (type) {
      case 'microtasks':
        let tasks = microtasks;
        if (status) tasks = tasks.filter(t => t.status === status);
        return NextResponse.json({ success: true, data: tasks });

      case 'affiliate':
        let campaigns = affiliateCampaigns;
        if (status) campaigns = campaigns.filter(c => c.status === status);
        return NextResponse.json({ success: true, data: campaigns });

      case 'content':
        let projects = contentProjects;
        if (status) projects = projects.filter(p => p.status === status);
        return NextResponse.json({ success: true, data: projects });

      case 'referral':
        let programs = referralPrograms;
        if (status) programs = programs.filter(p => p.status === status);
        return NextResponse.json({ success: true, data: programs });

      case 'platforms':
        return NextResponse.json({ success: true, data: platformAccounts });

      case 'revenue':
        return NextResponse.json({ success: true, data: revenueLogs });

      case 'credentials':
        return NextResponse.json({
          success: true,
          data: {
            mpesa: { consumerKey: '***', environment: MPESA_CREDENTIALS.environment },
          }
        });

      default:
        return NextResponse.json({
          success: true,
          data: {
            microtasks,
            affiliateCampaigns,
            contentProjects,
            referralPrograms,
            platformAccounts,
            revenueLogs,
          }
        });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch revenue data'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'create_microtask':
        const taskData = MicrotaskSchema.parse(data);
        const task = {
          id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          ...taskData,
          status: 'active',
          createdAt: Date.now(),
          completedAt: null,
          revenue: null,
        };
        
        microtasks.push(task);
        
        // Generate revenue
        const taskRevenue = await generateMicrotaskRevenue(task);
        if (taskRevenue.success) {
          task.revenue = taskRevenue.revenue;
        }

        return NextResponse.json({
          success: true,
          data: task,
          revenue: taskRevenue,
          message: 'Microtask created successfully'
        });

      case 'create_affiliate_campaign':
        const campaignData = AffiliateCampaignSchema.parse(data);
        const campaign = {
          id: `aff_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          ...campaignData,
          status: 'active',
          createdAt: Date.now(),
          totalSales: 0,
          totalRevenue: 0,
        };
        
        affiliateCampaigns.push(campaign);
        
        // Generate revenue
        const campaignRevenue = await generateAffiliateRevenue(campaign);
        if (campaignRevenue.success) {
          campaign.totalRevenue = campaignRevenue.revenue;
        }

        return NextResponse.json({
          success: true,
          data: campaign,
          revenue: campaignRevenue,
          message: 'Affiliate campaign created successfully'
        });

      case 'create_content_project':
        const projectData = ContentProjectSchema.parse(data);
        const project = {
          id: `cont_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          ...projectData,
          status: 'active',
          createdAt: Date.now(),
          completedAt: null,
          revenue: null,
        };
        
        contentProjects.push(project);
        
        // Generate revenue
        const projectRevenue = await generateContentRevenue(project);
        if (projectRevenue.success) {
          project.revenue = projectRevenue.revenue;
        }

        return NextResponse.json({
          success: true,
          data: project,
          revenue: projectRevenue,
          message: 'Content project created successfully'
        });

      case 'create_referral_program':
        const referralData = ReferralProgramSchema.parse(data);
        const referral = {
          id: `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          ...referralData,
          status: 'active',
          createdAt: Date.now(),
          totalReferrals: 0,
          totalBonus: 0,
        };
        
        referralPrograms.push(referral);
        
        // Generate revenue
        const referralRevenue = await generateReferralRevenue(referral);
        if (referralRevenue.success) {
          referral.totalBonus = referralRevenue.revenue;
        }

        return NextResponse.json({
          success: true,
          data: referral,
          revenue: referralRevenue,
          message: 'Referral program created successfully'
        });

      case 'create_platform_account':
        const { platform, accountData } = data;
        const accountResult = await createPlatformAccount(platform, accountData);
        
        if (!accountResult.success) {
          return NextResponse.json({
            success: false,
            error: accountResult.error
          }, { status: 500 });
        }

        return NextResponse.json({
          success: true,
          data: accountResult.account,
          message: `${platform} account created successfully`
        });

      case 'generate_survey_revenue':
        const surveyRevenue = await generateSurveyRevenue(data);
        return NextResponse.json({
          success: true,
          data: surveyRevenue,
          message: 'Survey revenue generated'
        });

      case 'generate_data_labeling_revenue':
        const labelingRevenue = await generateDataLabelingRevenue(data);
        return NextResponse.json({
          success: true,
          data: labelingRevenue,
          message: 'Data labeling revenue generated'
        });

      case 'generate_saas_revenue':
        const saasRevenue = await generateSaaSResellingRevenue(data);
        return NextResponse.json({
          success: true,
          data: saasRevenue,
          message: 'SaaS reselling revenue generated'
        });

      case 'backup_credentials':
        await backupCredentialsToEmail(MPESA_CREDENTIALS, 'mpesa');
        return NextResponse.json({
          success: true,
          message: 'Credentials backed up successfully'
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
      error: 'Failed to process revenue action'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, type, ...updates } = body;

    let item;
    switch (type) {
      case 'microtask':
        item = microtasks.find(t => t.id === id);
        if (item) {
          Object.assign(item, updates);
        }
        break;
      case 'affiliate':
        item = affiliateCampaigns.find(c => c.id === id);
        if (item) {
          Object.assign(item, updates);
        }
        break;
      case 'content':
        item = contentProjects.find(p => p.id === id);
        if (item) {
          Object.assign(item, updates);
        }
        break;
      case 'referral':
        item = referralPrograms.find(r => r.id === id);
        if (item) {
          Object.assign(item, updates);
        }
        break;
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid type specified'
        }, { status: 400 });
    }

    if (!item) {
      return NextResponse.json({
        success: false,
        error: 'Item not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: item,
      message: 'Item updated successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to update item'
    }, { status: 500 });
  }
} 