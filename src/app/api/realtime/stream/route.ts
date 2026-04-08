import { specificExports } from '@/lib/realtime/stream';

export async /**
 * GET function
 */
function GET(): any {
  const stream = createRealtimeEventStream();
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
