import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { proxyBackend, withServerError } from '../proxy';

export const dynamic = 'force-dynamic';

export async function opportunitiesGet(request: NextRequest): Promise<NextResponse> {
  const url = new URL(request.url);
  const query = url.searchParams.toString();
  const path = query ? `/opportunities?${query}` : '/opportunities';
  return withServerError(
    () => proxyBackend('GET', path, { errorFallback: 'Failed to fetch opportunities' }),
    'Failed to fetch opportunities',
    'Opportunities GET'
  );
}

export async function opportunitiesPost(request: NextRequest): Promise<NextResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get('sessionToken')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  return withServerError(
    () =>
      proxyBackend('POST', '/opportunities', {
        cookie: token,
        errorFallback: 'Failed to create opportunity',
        body,
      }),
    'Failed to create opportunity',
    'Opportunities POST'
  );
}

export async function opportunityGet(
  _request: NextRequest,
  params: Promise<{ id: string }>
): Promise<NextResponse> {
  const { id } = await params;
  return withServerError(
    () =>
      proxyBackend('GET', `/opportunities/${id}`, {
        errorFallback: 'Opportunity not found',
      }),
    'Failed to fetch opportunity',
    'Opportunity GET'
  );
}

export async function opportunityPatch(
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
      proxyBackend('PATCH', `/opportunities/${id}`, {
        cookie: token,
        errorFallback: 'Failed to update opportunity',
        body,
      }),
    'Failed to update opportunity',
    'Opportunity PATCH'
  );
}

export async function opportunityDelete(
  _request: NextRequest,
  params: Promise<{ id: string }>
): Promise<NextResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get('sessionToken')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  return withServerError(
    () =>
      proxyBackend('DELETE', `/opportunities/${id}`, {
        cookie: token,
        errorFallback: 'Failed to delete opportunity',
      }),
    'Failed to delete opportunity',
    'Opportunity DELETE'
  );
}

export async function opportunityApply(
  request: NextRequest,
  params: Promise<{ id: string }>
): Promise<NextResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get('sessionToken')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  return withServerError(
    () =>
      proxyBackend('POST', `/opportunities/${id}/apply`, {
        cookie: token,
        errorFallback: 'Failed to apply',
        body,
      }),
    'Failed to apply',
    'Apply'
  );
}

export async function opportunityFeedback(
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
      proxyBackend('POST', `/opportunities/${id}/feedback`, {
        cookie: token,
        errorFallback: 'Failed to submit feedback',
        body,
      }),
    'Failed to submit feedback',
    'Feedback POST'
  );
}

export async function opportunityApplicationsGet(
  _request: NextRequest,
  params: Promise<{ id: string }>
): Promise<NextResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get('sessionToken')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  return withServerError(
    () =>
      proxyBackend('GET', `/opportunities/${id}/applications`, {
        cookie: token,
        errorFallback: 'Failed to fetch applications',
      }),
    'Failed to fetch applications',
    'Applications GET'
  );
}

export async function opportunityAttendeesGet(
  _request: NextRequest,
  params: Promise<{ id: string }>
): Promise<NextResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get('sessionToken')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  return withServerError(
    () =>
      proxyBackend('GET', `/opportunities/${id}/attendees`, {
        cookie: token,
        errorFallback: 'Failed to fetch attendees',
      }),
    'Failed to fetch attendees',
    'Attendees GET'
  );
}

export async function opportunityVolunteerFeedback(
  request: NextRequest,
  params: Promise<{ id: string; volunteerId: string }>
): Promise<NextResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get('sessionToken')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id, volunteerId } = await params;
  const body = await request.json();
  return withServerError(
    () =>
      proxyBackend('POST', `/opportunities/${id}/volunteers/${volunteerId}/feedback`, {
        cookie: token,
        errorFallback: 'Failed to submit feedback',
        body,
      }),
    'Failed to submit feedback',
    'Volunteer feedback POST'
  );
}
