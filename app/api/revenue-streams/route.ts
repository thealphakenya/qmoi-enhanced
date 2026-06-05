import { NextRequest, NextResponse } from 'next/server';
import { validateMasterAuth } from '@/app/lib/auth/validate-master';

// Revenue stream data - In production, this would come from a database
const REVENUE_STREAMS = {
  'cloud-computing': {
    id: 'cloud-computing',
    name: 'Cloud Computing',
    tier: 1,
    dailyRevenue: 12000000,
    monthlyRevenue: 360000000,
    status: 'operational',
    growth: 0.12,
    clients: 5000,
    description: 'Global cloud computing platform with 50+ data centers',
    regions: ['north-america', 'europe', 'asia-pacific', 'south-america'],
  },
  'advertising-network': {
    id: 'advertising-network',
    name: 'Advertising Network',
    tier: 1,
    dailyRevenue: 12500000,
    monthlyRevenue: 375000000,
    status: 'operational',
    growth: 0.15,
    clients: 3500,
    description: 'Global advertising network across 195 countries',
    regions: ['all'],
  },
  'services-marketplace': {
    id: 'services-marketplace',
    name: 'Services Marketplace',
    tier: 1,
    dailyRevenue: 12000000,
    monthlyRevenue: 360000000,
    status: 'operational',
    growth: 0.10,
    clients: 8000,
    description: 'Global services marketplace connecting buyers and sellers',
    regions: ['north-america', 'europe', 'asia-pacific'],
  },
  'global-data-analytics': {
    id: 'global-data-analytics',
    name: 'Global Data & Analytics',
    tier: 1,
    dailyRevenue: 5000000,
    monthlyRevenue: 150000000,
    status: 'operational',
    growth: 0.18,
    clients: 10000,
    description: 'Real-time data analytics and insights platform',
    regions: ['all'],
  },
  'education-platform': {
    id: 'education-platform',
    name: 'Education Platform',
    tier: 1,
    dailyRevenue: 5000000,
    monthlyRevenue: 150000000,
    status: 'operational',
    growth: 0.14,
    clients: 2000,
    description: 'Global online education and certification platform',
    regions: ['all'],
  },
  'digital-marketing': {
    id: 'digital-marketing',
    name: 'Digital Marketing Agency',
    tier: 2,
    dailyRevenue: 900000,
    monthlyRevenue: 27000000,
    status: 'operational',
    growth: 0.20,
    clients: 500,
    description: 'Full-service digital agency with 6 core services',
    regions: ['americas', 'europe', 'asia-pacific'],
  },
  'saas-products': {
    id: 'saas-products',
    name: 'SaaS Product Suite',
    tier: 2,
    dailyRevenue: 800000,
    monthlyRevenue: 24000000,
    status: 'operational',
    growth: 0.18,
    clients: 100000,
    description: 'Subscription-based software products',
    regions: ['all'],
  },
  'mobile-games': {
    id: 'mobile-games',
    name: 'Mobile Game Development',
    tier: 2,
    dailyRevenue: 700000,
    monthlyRevenue: 21000000,
    status: 'operational',
    growth: 0.16,
    clients: 10000000,
    description: '30+ casual games with 10M+ DAU',
    regions: ['all'],
  },
  'consulting': {
    id: 'consulting',
    name: 'Enterprise AI Consulting',
    tier: 1,
    dailyRevenue: 2000000,
    monthlyRevenue: 60000000,
    status: 'operational',
    growth: 0.12,
    clients: 40,
    description: 'Fortune 500 AI consulting services',
    regions: ['all'],
  },
  'app-generation': {
    id: 'app-generation',
    name: 'App Generation as a Service',
    tier: 1,
    dailyRevenue: 2500000,
    monthlyRevenue: 75000000,
    status: 'operational',
    growth: 0.14,
    clients: 5000,
    description: 'AI-powered automated app creation',
    regions: ['all'],
  },
};

/**
 * GET /api/revenue-streams
 * List all revenue streams with filtering
 */
export async function GET(request: NextRequest) {
  try {
    const validation = await validateMasterAuth(request);
    if (!validation.authenticated) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Master authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'active';
    const tier = searchParams.get('tier');
    const sortBy = searchParams.get('sortBy') || 'dailyRevenue';

    // Filter streams
    let streams = Object.values(REVENUE_STREAMS).filter(stream => {
      if (status !== 'all' && stream.status !== status) return false;
      if (tier && stream.tier !== parseInt(tier)) return false;
      return true;
    });

    // Sort streams
    streams.sort((a, b) => {
      if (sortBy === 'dailyRevenue') {
        return (b.dailyRevenue || 0) - (a.dailyRevenue || 0);
      } else if (sortBy === 'growth') {
        return (b.growth || 0) - (a.growth || 0);
      } else if (sortBy === 'clients') {
        return (b.clients || 0) - (a.clients || 0);
      }
      return 0;
    });

    return NextResponse.json({
      success: true,
      data: streams,
      count: streams.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Revenue Streams Error]', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/revenue-streams
 * Create new revenue stream (master only)
 */
export async function POST(request: NextRequest) {
  try {
    const validation = await validateMasterAuth(request);
    if (!validation.authenticated) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Master authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    const newStream = {
      id: body.id || `stream-${Date.now()}`,
      name: body.name,
      tier: body.tier || 2,
      dailyRevenue: body.dailyRevenue || 0,
      monthlyRevenue: (body.dailyRevenue || 0) * 30,
      status: body.status || 'pending',
      growth: body.growth || 0,
      clients: body.clients || 0,
      description: body.description || '',
      regions: body.regions || [],
      createdAt: new Date().toISOString(),
      createdBy: validation.masterId,
    };

    return NextResponse.json({
      success: true,
      data: newStream,
      message: 'Revenue stream created',
      timestamp: new Date().toISOString(),
    }, { status: 201 });
  } catch (error) {
    console.error('[Create Revenue Stream Error]', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to create revenue stream',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
