import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { proxyBackend, withServerError } from '../proxy';

export const dynamic = 'force-dynamic';

export async function storagePost(request: NextRequest): Promise<NextResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get('sessionToken')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const formData = await request.formData();
  return withServerError(
    () =>
      proxyBackend('POST', '/storage', {
        cookie: token,
        errorFallback: 'Upload failed',
        formData,
      }),
    'Upload failed',
    'Storage upload'
  );
}
