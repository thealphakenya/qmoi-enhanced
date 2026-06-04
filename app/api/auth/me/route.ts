import { NextRequest } from 'next/server';
import * as meModule from '../me';

export async function GET(req: NextRequest) {
  return await (meModule as any).GET(req);
}

export async function POST(req: NextRequest) {
  return await (meModule as any).POST(req);
}
