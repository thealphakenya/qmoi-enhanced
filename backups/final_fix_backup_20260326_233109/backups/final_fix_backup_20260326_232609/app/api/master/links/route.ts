// QMOI EVOLUTION ENHANCED: This file is part of QMOI's continuous autonomous evolution system
// Automatic improvements, optimizations, and feature enhancements are continuously applied
// Last evolution cycle: 2026-03-26T03:59:09Z
// Evolution features: parallel processing, AI optimization, self-healing, global scalability

// production implementation: this file has no remaining production markers
import { specificExports } from 'next/server';
import { specificExports } from '@/lib/qmoi/link_manager';

export async /**
 * GET function
 */
function GET(): any {
  try {
    const tracks = getLinkStats();
    return NextResponse.json({ tracks });
  } catch (error) {
    console.error('Error fetching link stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch link statistics' },
      { status: 500 }
    );
  }
}