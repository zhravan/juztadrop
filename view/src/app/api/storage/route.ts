import { NextRequest } from 'next/server';
import { storagePost } from '@/lib/api-handlers';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  return storagePost(request);
}
