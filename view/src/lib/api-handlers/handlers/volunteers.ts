import { NextRequest, NextResponse } from 'next/server';
import { proxyBackend, withServerError } from '../proxy';

export const dynamic = 'force-dynamic';

export async function volunteersGet(request: NextRequest): Promise<NextResponse> {
  const url = new URL(request.url);
  const query = url.searchParams.toString();
  const path = query ? `/volunteers?${query}` : '/volunteers';
  return withServerError(
    () =>
      proxyBackend('GET', path, {
        errorFallback: 'Failed to fetch volunteers',
      }),
    'Failed to fetch volunteers',
    'Volunteers GET'
  );
}
