// QMOI EVOLUTION ENHANCED: Global News Capture System
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-28T00:00:00Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability
import { NextRequest, NextResponse } from 'next/server';
import { globalNewsService } from '@/lib/global-news-service';
export async function GET(request: NextRequest): Promise<any> {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const limit = parseInt(searchParams.get('limit') || '10');
  const category = searchParams.get('category');
  const region = searchParams.get('region');
  try {
    switch (action) {
      case 'get-news':
        const news = await globalNewsService.getLatestArticles(limit);
        return NextResponse.json({ success: true, data: news });
      case 'get-categories':
        // Return available categories from articles
        const articles = await globalNewsService.getLatestArticles(100);
        const categories = [...new Set(articles.map(a => a.category))];
        return NextResponse.json({ success: true, data: categories });
      case 'get-sources':
        // Return available sources from articles
        const allArticles = await globalNewsService.getLatestArticles(100);
        const sources = [...new Set(allArticles.map(a => a.source))];
        return NextResponse.json({ success: true, data: sources });
      case 'search':
        const query = searchParams.get('query') || '';
        const searchResults = await globalNewsService.searchArticles(query);
        return NextResponse.json({ success: true, data: searchResults });
      case 'trending':
        const trending = await globalNewsService.getTrendingTopics();
        return NextResponse.json({ success: true, data: trending });
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Use: get-news, get-categories, get-sources, search, trending'
        });
    }
  } catch (_error){
    return NextResponse.json({
      success: false,
      _error: 'Failed to process global news request'
    }, { status: 500 });
  }
}
export async function POST(request: NextRequest): Promise<any> {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  try {
    const body = await request.json();
    switch (action) {
      case 'capture-news':
      case 'add-article':
        const result = await globalNewsService.addArticle(body);
        return NextResponse.json({ success: true, data: { id: result } });
      case 'search':
        const searchResults = await globalNewsService.searchArticles(body.query || '');
        return NextResponse.json({ success: true, data: searchResults });
      case 'sentiment':
        const sentiment = await globalNewsService.analyzeSentiment();
        return NextResponse.json({ success: true, data: sentiment });
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Use: add-article, search, sentiment'
        });
    }
  } catch (_error){
    return NextResponse.json({
      success: false,
      _error: 'Failed to process global news request'
    }, { status: 500 });
  }
}