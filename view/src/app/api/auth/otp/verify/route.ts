import { NextRequest } from 'next/server';
import { authOtpVerify } from '@/lib/api-handlers';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  return authOtpVerify(request);
}
