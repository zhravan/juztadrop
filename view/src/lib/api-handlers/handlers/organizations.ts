import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getBackendUrl, getApiErrorMessage } from '@/lib/api-proxy';
import { withServerError } from '../proxy';

export const dynamic = 'force-dynamic';

async function parseJsonRes(res: Response): Promise<Record<string, unknown>> {
  const text = await res.text();
  try {
    return (text ? JSON.parse(text) : {}) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export async function organizationsPost(request: NextRequest): Promise<NextResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get('sessionToken')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return withServerError(
    async () => {
      const body = await request.json();
      const res = await fetch(`${getBackendUrl()}/organizations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `sessionToken=${token}`,
        },
        body: JSON.stringify(body),
      });
      const json = await parseJsonRes(res);
      if (!res.ok) {
        return NextResponse.json(
          { error: getApiErrorMessage(json, 'Failed to create organization') },
          { status: res.status }
        );
      }
      return NextResponse.json(json?.data ?? json);
    },
    'Failed to create organization',
    'Organizations POST'
  );
}

export async function organizationsGet(): Promise<NextResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get('sessionToken')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return withServerError(
    async () => {
      const res = await fetch(`${getBackendUrl()}/organizations/me`, {
        method: 'GET',
        headers: { Cookie: `sessionToken=${token}` },
        cache: 'no-store',
      });
      const json = await parseJsonRes(res);
      if (!res.ok) {
        return NextResponse.json(
          { error: getApiErrorMessage(json, 'Failed to fetch organizations') },
          { status: res.status }
        );
      }
      return NextResponse.json(json?.data ?? json);
    },
    'Failed to fetch organizations',
    'Organizations GET'
  );
}
