import { NextRequest } from 'next/server';
import { authOtpSend } from '@/lib/api-handlers';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  return authOtpSend(request);
}
