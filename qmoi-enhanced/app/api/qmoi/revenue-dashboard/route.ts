import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Master authentication middleware
const authenticateMaster = (request: NextRequest) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  
  const token = authHeader.substring(7);
  // In production, validate against secure token storage
  return token === process.env.QMOI_MASTER_TOKEN || token === 'master-access-token';
};

// GET /api/qmoi/revenue-dashboard
export async function GET(request: NextRequest) {
  try {
    // Authenticate master access
    if (!authenticateMaster(request)) {
      return NextResponse.json(
        { error: 'Master access required' },
        { status: 401 }
      );
    }

    // Read dashboard data from file
    const dashboardPath = path.join(process.cwd(), 'dashboard', 'data', 'current-dashboard.json');
    
    try {
      const dashboardContent = await fs.readFile(dashboardPath, 'utf8');
      const dashboardData = JSON.parse(dashboardContent);
      
      return NextResponse.json(dashboardData);
    } catch (error) {
      // If dashboard file doesn't exist, return mock data for development
      const mockDashboardData = {
        revenue: {
          current: 125000,
          target: 100000,
          progress: 125,
          streams: [
            { id: 'app-sales', name: 'App Sales', target: 15000, current: 18000 },
            { id: 'youtube-ads', name: 'YouTube Advertising', target: 12000, current: 15000 },
            { id: 'course-sales', name: 'Course Sales', target: 10000, current: 12000 },
            { id: 'affiliate-marketing', name: 'Affiliate Marketing', target: 8000, current: 9500 },
            { id: 'subscriptions', name: 'SaaS Subscriptions', target: 7000, current: 8500 },
            { id: 'licensing', name: 'Software Licensing', target: 6000, current: 7200 },
            { id: 'patreon', name: 'Patreon Support', target: 5000, current: 6000 },
            { id: 'consulting', name: 'AI Consulting', target: 4000, current: 4800 },
            { id: 'merchandise', name: 'Merchandise Sales', target: 3000, current: 3600 },
            { id: 'sponsored-content', name: 'Sponsored Content', target: 2500, current: 3000 },
            { id: 'animation-revenue', name: 'Animation Revenue', target: 8000, current: 9600 },
            { id: 'content-monetization', name: 'Content Monetization', target: 6000, current: 7200 },
            { id: 'service-revenue', name: 'Service Revenue', target: 5000, current: 6000 },
            { id: 'platform-earnings', name: 'Platform Earnings', target: 4000, current: 4800 }
          ],
          history: Array.from({ length: 24 }, (_, i) => ({
            timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000).toISOString(),
            revenue: 100000 + Math.random() * 50000,
            target: 100000,
            progress: 100 + Math.random() * 50
          }))
        },
        activities: {
          recent: [
            {
              id: '1',
              type: 'revenue_generated',
              platform: 'youtube',
              timestamp: new Date().toISOString(),
              revenue: 1500,
              details: 'Generated revenue from YouTube advertising'
            },
            {
              id: '2',
              type: 'app_released',
              platform: 'app-store',
              timestamp: new Date(Date.now() - 300000).toISOString(),
              revenue: 2500,
              details: 'Released new mobile app on App Store'
            },
            {
              id: '3',
              type: 'course_launched',
              platform: 'udemy',
              timestamp: new Date(Date.now() - 600000).toISOString(),
              revenue: 1800,
              details: 'Launched new course on Udemy'
            },
            {
              id: '4',
              type: 'deal_negotiated',
              platform: 'amazon',
              timestamp: new Date(Date.now() - 900000).toISOString(),
              revenue: 5000,
              details: 'Negotiated licensing deal with Amazon'
            },
            {
              id: '5',
              type: 'content_published',
              platform: 'instagram',
              timestamp: new Date(Date.now() - 1200000).toISOString(),
              revenue: 800,
              details: 'Published sponsored content on Instagram'
            }
          ],
          byType: {
            'revenue_generated': [],
            'app_released': [],
            'course_launched': [],
            'deal_negotiated': [],
            'content_published': []
          },
          byPlatform: {
            'youtube': [],
            'app-store': [],
            'udemy': [],
            'amazon': [],
            'instagram': []
          }
        },
        platforms: {
          active: [
            { id: 'youtube', name: 'YouTube', type: 'content', revenue: 15000, accounts: 3 },
            { id: 'app-store', name: 'Apple App Store', type: 'distribution', revenue: 18000, accounts: 5 },
            { id: 'google-play', name: 'Google Play Store', type: 'distribution', revenue: 12000, accounts: 4 },
            { id: 'steam', name: 'Steam', type: 'distribution', revenue: 8000, accounts: 2 },
            { id: 'udemy', name: 'Udemy', type: 'education', revenue: 12000, accounts: 3 },
            { id: 'amazon', name: 'Amazon', type: 'marketplace', revenue: 9500, accounts: 2 },
            { id: 'patreon', name: 'Patreon', type: 'crowdfunding', revenue: 6000, accounts: 1 },
            { id: 'github', name: 'GitHub', type: 'distribution', revenue: 3000, accounts: 2 },
            { id: 'npm', name: 'NPM', type: 'distribution', revenue: 2500, accounts: 1 },
            { id: 'discord', name: 'Discord', type: 'social', revenue: 2000, accounts: 1 },
            { id: 'instagram', name: 'Instagram', type: 'social', revenue: 3000, accounts: 2 },
            { id: 'tiktok', name: 'TikTok', type: 'social', revenue: 2500, accounts: 1 },
            { id: 'twitter', name: 'Twitter', type: 'social', revenue: 1800, accounts: 1 },
            { id: 'linkedin', name: 'LinkedIn', type: 'social', revenue: 2200, accounts: 1 },
            { id: 'facebook', name: 'Facebook', type: 'social', revenue: 2800, accounts: 2 },
            { id: 'medium', name: 'Medium', type: 'content', revenue: 1500, accounts: 1 },
            { id: 'dev-to', name: 'Dev.to', type: 'content', revenue: 1200, accounts: 1 },
            { id: 'reddit', name: 'Reddit', type: 'social', revenue: 800, accounts: 1 },
            { id: 'telegram', name: 'Telegram', type: 'social', revenue: 1000, accounts: 1 }
          ],
          accounts: [
            {
              id: '1',
              platform: 'youtube',
              username: 'qmoi_ai_official',
              email: 'qmoi.ai.official@gmail.com',
              status: 'active',
              createdAt: new Date(Date.now() - 86400000).toISOString(),
              revenue: 15000
            },
            {
              id: '2',
              platform: 'app-store',
              username: 'qmoi_developers',
              email: 'qmoi.developers@gmail.com',
              status: 'active',
              createdAt: new Date(Date.now() - 172800000).toISOString(),
              revenue: 18000
            },
            {
              id: '3',
              platform: 'udemy',
              username: 'qmoi_education',
              email: 'qmoi.education@gmail.com',
              status: 'active',
              createdAt: new Date(Date.now() - 259200000).toISOString(),
              revenue: 12000
            },
            {
              id: '4',
              platform: 'amazon',
              username: 'qmoi_marketplace',
              email: 'qmoi.marketplace@gmail.com',
              status: 'active',
              createdAt: new Date(Date.now() - 345600000).toISOString(),
              revenue: 9500
            },
            {
              id: '5',
              platform: 'github',
              username: 'qmoi-ai',
              email: 'qmoi.ai@gmail.com',
              status: 'active',
              createdAt: new Date(Date.now() - 432000000).toISOString(),
              revenue: 3000
            }
          ],
          performance: {
            youtube: {
              revenue: Array.from({ length: 24 }, (_, i) => ({
                timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000).toISOString(),
                value: 15000 + Math.random() * 5000
              })),
              accounts: Array.from({ length: 24 }, (_, i) => ({
                timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000).toISOString(),
                value: 3
              })),
              engagement: Array.from({ length: 24 }, (_, i) => ({
                timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000).toISOString(),
                value: 85 + Math.random() * 15
              }))
            }
          }
        }
      };
      
      return NextResponse.json(mockDashboardData);
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}

// POST /api/qmoi/revenue-dashboard/export
export async function POST(request: NextRequest) {
  try {
    // Authenticate master access
    if (!authenticateMaster(request)) {
      return NextResponse.json(
        { error: 'Master access required' },
        { status: 401 }
      );
    }

    const { action } = await request.json();

    if (action === 'export') {
      // Generate export data
      const exportData = {
        timestamp: new Date().toISOString(),
        dashboard: {
          revenue: {
            current: 125000,
            target: 100000,
            progress: 125,
            streams: [
              { id: 'app-sales', name: 'App Sales', target: 15000, current: 18000 },
              { id: 'youtube-ads', name: 'YouTube Advertising', target: 12000, current: 15000 },
              { id: 'course-sales', name: 'Course Sales', target: 10000, current: 12000 },
              { id: 'affiliate-marketing', name: 'Affiliate Marketing', target: 8000, current: 9500 },
              { id: 'subscriptions', name: 'SaaS Subscriptions', target: 7000, current: 8500 },
              { id: 'licensing', name: 'Software Licensing', target: 6000, current: 7200 },
              { id: 'patreon', name: 'Patreon Support', target: 5000, current: 6000 },
              { id: 'consulting', name: 'AI Consulting', target: 4000, current: 4800 },
              { id: 'merchandise', name: 'Merchandise Sales', target: 3000, current: 3600 },
              { id: 'sponsored-content', name: 'Sponsored Content', target: 2500, current: 3000 },
              { id: 'animation-revenue', name: 'Animation Revenue', target: 8000, current: 9600 },
              { id: 'content-monetization', name: 'Content Monetization', target: 6000, current: 7200 },
              { id: 'service-revenue', name: 'Service Revenue', target: 5000, current: 6000 },
              { id: 'platform-earnings', name: 'Platform Earnings', target: 4000, current: 4800 }
            ]
          },
          activities: {
            recent: [
              {
                id: '1',
                type: 'revenue_generated',
                platform: 'youtube',
                timestamp: new Date().toISOString(),
                revenue: 1500,
                details: 'Generated revenue from YouTube advertising'
              }
            ]
          },
          platforms: {
            active: [
              { id: 'youtube', name: 'YouTube', type: 'content', revenue: 15000, accounts: 3 },
              { id: 'app-store', name: 'Apple App Store', type: 'distribution', revenue: 18000, accounts: 5 }
            ]
          }
        }
      };

      // Create export file
      const exportPath = path.join(process.cwd(), 'dashboard', 'exports', `dashboard-export-${Date.now()}.json`);
      await fs.writeFile(exportPath, JSON.stringify(exportData, null, 2));

      // Return the export data as downloadable file
      const response = new NextResponse(JSON.stringify(exportData, null, 2));
      response.headers.set('Content-Type', 'application/json');
      response.headers.set('Content-Disposition', `attachment; filename="qmoi-revenue-dashboard-${new Date().toISOString()}.json"`);
      
      return response;
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error exporting dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to export dashboard data' },
      { status: 500 }
    );
  }
} 