import { NextRequest } from 'next/server';
import { organizationsPost, organizationsGet } from '@/lib/api-handlers';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  return organizationsPost(request);
}

export async function GET(request: NextRequest) {
  return organizationsGet();
}
