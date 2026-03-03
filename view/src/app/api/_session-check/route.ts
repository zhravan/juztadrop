import { sessionCheckGet } from '@/lib/api-handlers';

export const dynamic = 'force-dynamic';

/**
 * Debug route: returns whether a session cookie is present.
 * Visit /api/_session-check to see if cookies are reaching the server.
 */
export async function GET() {
  return sessionCheckGet();
}
