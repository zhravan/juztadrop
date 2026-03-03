import { NextRequest } from 'next/server';
import { opportunitiesGet, opportunitiesPost } from '@/lib/api-handlers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return opportunitiesGet(request);
}

export async function POST(request: NextRequest) {
  return opportunitiesPost(request);
}
