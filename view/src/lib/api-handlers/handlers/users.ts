import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { proxyBackend, withServerError } from '../proxy';

export const dynamic = 'force-dynamic';

export async function usersMePatch(request: NextRequest): Promise<NextResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get('sessionToken')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return withServerError(
    async () => {
      const body = await request.json();
      const res = await proxyBackend('PATCH', '/users/me', {
        cookie: token,
        errorFallback: 'Failed to update',
        body,
      });
      if (res.status !== 200) return res;
      const data = await res.json();
      if (data?.user === null) {
        return NextResponse.json({ error: 'User not found after update' }, { status: 500 });
      }
      return NextResponse.json(data);
    },
    'Failed to update profile',
    'Users me PATCH'
  );
}
