import { NextRequest } from 'next/server';
import { applicationPatch } from '@/lib/api-handlers';

export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  return applicationPatch(request, context.params);
}
