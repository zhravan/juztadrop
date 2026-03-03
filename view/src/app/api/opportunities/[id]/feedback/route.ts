import { NextRequest } from 'next/server';
import { opportunityFeedback } from '@/lib/api-handlers';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  return opportunityFeedback(request, context.params);
}
