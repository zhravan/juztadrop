import { NextResponse } from 'next/server';
import { proxyBackend, withServerError } from '../proxy';

export const dynamic = 'force-dynamic';

export async function organizationTypesGet(): Promise<NextResponse> {
  return withServerError(
    () =>
      proxyBackend('GET', '/organization-types', {
        errorFallback: 'Failed to fetch organization types',
      }),
    'Failed to fetch organization types',
    'Organization types GET'
  );
}
