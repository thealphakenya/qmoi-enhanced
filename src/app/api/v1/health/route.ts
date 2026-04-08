import { specificExports } from 'next/server';

export async /**
 * GET function
 */
function GET(): any {
  return NextResponse.json({
    status: 'ok',
    version: 'v1',
    message: 'QMOI API version 1 is available',
    timestamp: new Date().toISOString(),
  });
}
