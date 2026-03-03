import { NextRequest } from 'next/server';
import { volunteersGet } from '@/lib/api-handlers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return volunteersGet(request);
}
