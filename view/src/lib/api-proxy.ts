/**
 * Shared config for Next.js API routes that proxy to the backend.
 * Use getBackendErrorHint() in catch blocks to return helpful errors when
 * the backend is unreachable.
 * Use getApiErrorMessage() to normalize error responses (backend shape or proxy shape).
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function getBackendUrl(): string {
  return API_URL;
}

/**
 * Extract a user-facing error message from an API response body.
 * Backend returns { success: false, error: { message, code?, details? } }.
 * Proxies may return { error: string } or the same shape.
 * Use in both route handlers (when forwarding backend errors) and client code (when handling fetch responses).
 */
export function getApiErrorMessage(data: unknown, fallback: string): string {
  if (data == null || typeof data !== 'object') return fallback;
  const obj = data as Record<string, unknown>;
  const err = obj.error;
  if (typeof err === 'string') return err;
  if (
    err &&
    typeof err === 'object' &&
    'message' in err &&
    typeof (err as Record<string, unknown>).message === 'string'
  ) {
    return (err as Record<string, unknown>).message as string;
  }
  if (typeof obj.message === 'string') return obj.message;
  return fallback;
}

export function getBackendErrorHint(error: unknown): string {
  const err = error instanceof Error ? error : new Error(String(error));
  const cause = err.cause instanceof Error ? err.cause : null;
  const message = cause?.message ?? err.message ?? String(error);

  // Common connection errors
  if (
    message.includes('ECONNREFUSED') ||
    message.includes('fetch failed') ||
    message.includes('network')
  ) {
    return `Backend unreachable at ${API_URL}. Is it running? Start with: cd api && bun run dev`;
  }

  return `Backend error: ${message}`;
}
