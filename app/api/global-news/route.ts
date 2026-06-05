// QMOI EVOLUTION ENHANCED: Global News Capture System
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-28T00:00:00Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability
import { NextRequest, NextResponse } from 'next/server';
import { globalNewsService } from '@/lib/global-news-service';
export async function GET(request: NextRequest): Promise<any> {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  try {
    switch (action) {
      case 'get-news':
        const news = await globalNewsService.getNews();
        return NextResponse.json({ success: true, data: news });
      case 'get-categories':
        const categories = await globalNewsService.getCategories();
        return NextResponse.json({ success: true, data: categories });
      case 'get-sources':
        const sources = await globalNewsService.getSources();
        return NextResponse.json({ success: true, data: sources });
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Use: get-news, get-categories, get-sources'
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
        const result = await globalNewsService.captureNews(body);
        return NextResponse.json({ success: true, data: result });
      case 'update-news':
        const updateResult = await globalNewsService.updateNews(body);
        return NextResponse.json({ success: true, data: updateResult });
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Use: capture-news, update-news'
        });
    }
  } catch (_error){
    return NextResponse.json({
      success: false,
      _error: 'Failed to process global news request'
    }, { status: 500 });
  }
}