/**
 * Server-side helpers to proxy requests to the backend and return NextResponse.
 * Used by lib/api handlers (which are invoked from app/api route.ts files).
 */

import { NextResponse } from 'next/server';
import { getBackendUrl, getApiErrorMessage, getBackendErrorHint } from '@/lib/api-proxy';

export interface ProxyOptions {
  /** Session token for authenticated requests */
  cookie?: string | null;
  /** Fallback message when backend returns an error and we cannot extract message */
  errorFallback: string;
  /** Optional success transform: (json) => response body to return (default: json?.data ?? json) */
  transformSuccess?: (json: unknown) => unknown;
}

async function parseJson(res: Response): Promise<unknown> {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
}

/**
 * Proxy a request to the backend and return a NextResponse.
 * On backend error (!res.ok), returns NextResponse with { error: string } and appropriate status.
 * On network/throw, returns 500 with optional hint in development.
 */
export async function proxyBackend(
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  path: string,
  options: ProxyOptions & { body?: object; formData?: FormData }
): Promise<NextResponse> {
  const { cookie, errorFallback, transformSuccess } = options;
  const url = `${getBackendUrl()}${path}`;
  const headers: Record<string, string> = {};
  if (cookie) headers['Cookie'] = `sessionToken=${cookie}`;

  let body: string | FormData | undefined;
  if (options.formData) {
    body = options.formData;
  } else if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(options.body);
  }

  const res = await fetch(url, {
    method,
    headers: Object.keys(headers).length ? headers : undefined,
    body,
    cache: method === 'GET' ? 'no-store' : undefined,
  });

  const json = await parseJson(res);
  if (!res.ok) {
    return NextResponse.json(
      { error: getApiErrorMessage(json, errorFallback) },
      { status: res.status }
    );
  }
  const data = transformSuccess
    ? transformSuccess(json)
    : ((json as Record<string, unknown>)?.data ?? json);
  return NextResponse.json(data);
}

/**
 * Wrap a handler that may throw; on throw, return 500 with error message and optional hint.
 */
export function withServerError(
  fn: () => Promise<NextResponse>,
  fallbackError: string,
  logLabel: string
): Promise<NextResponse> {
  return fn().catch((error) => {
    console.error(`${logLabel}:`, error);
    const hint = getBackendErrorHint(error);
    return NextResponse.json(
      {
        error: fallbackError,
        ...(process.env.NODE_ENV === 'development' && { hint }),
      },
      { status: 500 }
    );
  });
}
