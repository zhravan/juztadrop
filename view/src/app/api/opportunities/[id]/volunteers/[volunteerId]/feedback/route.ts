import { NextRequest } from 'next/server';
import { opportunityVolunteerFeedback } from '@/lib/api-handlers';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string; volunteerId: string }> }
) {
  return opportunityVolunteerFeedback(request, context.params);
}
