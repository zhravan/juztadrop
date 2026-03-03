import { NextRequest } from 'next/server';
import { opportunityAttendeesGet } from '@/lib/api-handlers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  return opportunityAttendeesGet(request, context.params);
}
