import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getBackendUrl } from '@/lib/api-proxy';

export const dynamic = 'force-dynamic';

/**
 * Debug: returns whether a session cookie is present.
 * Visit /api/_session-check to see if cookies are reaching the server.
 */
export async function sessionCheckGet(): Promise<NextResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get('sessionToken')?.value;
  return NextResponse.json({
    hasSessionCookie: !!token,
    cookieLength: token ? token.length : 0,
  });
}

/**
 * Diagnostic: check if the Next.js server can reach the backend API.
 * Visit /api/_proxy-status to see connection status.
 */
export async function proxyStatusGet(): Promise<NextResponse> {
  const API_URL = getBackendUrl();
  const isDev = process.env.NODE_ENV === 'development';

  try {
    const res = await fetch(`${API_URL}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    const ok = res.ok;
    const body = await res.json().catch(() => null);

    return NextResponse.json({
      ok: !!ok,
      backendReachable: true,
      backendUrl: isDev ? API_URL : '[hidden]',
      backendStatus: res.status,
      backendResponse: body,
      message: ok
        ? 'Backend is reachable and healthy'
        : `Backend responded with status ${res.status}`,
    });
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    const cause = err.cause instanceof Error ? err.cause.message : err.cause;
    return NextResponse.json(
      {
        ok: false,
        backendReachable: false,
        backendUrl: isDev ? API_URL : '[hidden]',
        error: err.message,
        cause: cause ?? undefined,
        hint: 'Is the backend running? Start it with: cd api && bun run dev',
      },
      { status: 503 }
    );
  }
}
