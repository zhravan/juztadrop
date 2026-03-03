import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { proxyBackend, withServerError } from '../proxy';

export const dynamic = 'force-dynamic';

export async function applicationsMeGet(): Promise<NextResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get('sessionToken')?.value;
  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized', hint: 'No session cookie. Try logging in again.' },
      { status: 401 }
    );
  }
  return withServerError(
    () =>
      proxyBackend('GET', '/applications/me', {
        cookie: token,
        errorFallback: 'Failed to fetch applications',
      }),
    'Failed to fetch applications',
    'Applications me GET'
  );
}

export async function applicationPatch(
  request: NextRequest,
  params: Promise<{ id: string }>
): Promise<NextResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get('sessionToken')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json();
  return withServerError(
    () =>
      proxyBackend('PATCH', `/applications/${id}`, {
        cookie: token,
        errorFallback: 'Failed to update application',
        body,
      }),
    'Failed to update application',
    'Application PATCH'
  );
}
