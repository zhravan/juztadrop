import { NextRequest } from 'next/server';
import { usersMePatch } from '@/lib/api-handlers';

export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest) {
  return usersMePatch(request);
}
