import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getBackendUrl, getBackendErrorHint, getApiErrorMessage } from '@/lib/api-proxy';
import { withServerError } from '../proxy';

export const dynamic = 'force-dynamic';

export async function authOtpSend(request: NextRequest): Promise<NextResponse> {
  return withServerError(
    async () => {
      const body = await request.json();
      const res = await fetch(`${getBackendUrl()}/auth/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        return NextResponse.json(
          { error: getApiErrorMessage(json, 'Failed to send code') },
          { status: res.status }
        );
      }
      return NextResponse.json(json?.data ?? {});
    },
    'Failed to send verification code',
    'Auth OTP send'
  );
}

export async function authOtpVerify(request: NextRequest): Promise<NextResponse> {
  return withServerError(
    async () => {
      const body = await request.json();
      const res = await fetch(`${getBackendUrl()}/auth/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        return NextResponse.json(
          { error: getApiErrorMessage(json, 'Invalid or expired code') },
          { status: res.status }
        );
      }
      let token: string | null = null;
      const setCookieHeaders =
        (typeof res.headers.getSetCookie === 'function' ? res.headers.getSetCookie() : null) ??
        (res.headers.get('set-cookie') ? [res.headers.get('set-cookie')!] : []);
      for (const header of setCookieHeaders) {
        const match = header.match(/sessionToken=([^;\s]+)/);
        if (match?.[1]) {
          token = match[1];
          break;
        }
      }
      if (!token) {
        const data = json?.data ?? json;
        if (data?.token && typeof data.token === 'string') token = data.token;
      }
      if (token) {
        const cookieStore = await cookies();
        cookieStore.set('sessionToken', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 30 * 24 * 60 * 60,
        });
      }
      const data = json?.data ?? json;
      const { token: _, ...safe } = typeof data === 'object' && data ? data : {};
      return NextResponse.json(Object.keys(safe).length ? safe : json);
    },
    'Failed to verify code',
    'Auth OTP verify'
  );
}

export async function authMe(): Promise<NextResponse> {
  return withServerError(
    async () => {
      const cookieStore = await cookies();
      const token = cookieStore.get('sessionToken')?.value;
      if (!token) {
        return NextResponse.json(null, { status: 401 });
      }
      const res = await fetch(`${getBackendUrl()}/auth/me`, {
        method: 'GET',
        headers: { Cookie: `sessionToken=${token}` },
        cache: 'no-store',
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        return NextResponse.json(null, { status: res.status });
      }
      const data = json?.data ?? json;
      return NextResponse.json(data?.user ?? data);
    },
    'Failed to get session',
    'Auth me'
  );
}

export async function authLogout(): Promise<NextResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get('sessionToken')?.value;
  try {
    if (token) {
      await fetch(`${getBackendUrl()}/auth/logout`, {
        method: 'POST',
        headers: { Cookie: `sessionToken=${token}` },
      });
    }
  } catch (error) {
    console.error('Auth logout error:', error);
  } finally {
    cookieStore.delete('sessionToken');
  }
  return NextResponse.json({ message: 'Logged out successfully' });
}
