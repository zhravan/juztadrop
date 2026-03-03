import { NextResponse } from 'next/server';
import { proxyBackend, withServerError } from '../proxy';

export const dynamic = 'force-dynamic';

export async function causesGet(): Promise<NextResponse> {
  return withServerError(
    () =>
      proxyBackend('GET', '/causes', {
        errorFallback: 'Failed to fetch causes',
      }),
    'Failed to fetch causes',
    'Causes GET'
  );
}

export async function causePost(body: {
  value: string;
  label: string;
  sortOrder?: number;
}): Promise<NextResponse> {
  return withServerError(
    () =>
      proxyBackend('POST', '/causes', {
        body,
        errorFallback: 'Failed to create cause',
      }),
    'Failed to create cause',
    'Causes POST'
  );
}
