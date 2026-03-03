import { NextRequest } from 'next/server';
import { opportunityApplicationsGet } from '@/lib/api-handlers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  return opportunityApplicationsGet(request, context.params);
}
