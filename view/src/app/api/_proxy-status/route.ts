import { proxyStatusGet } from '@/lib/api-handlers';

export const dynamic = 'force-dynamic';

/**
 * Diagnostic route to check if the Next.js server can reach the backend API.
 * Visit /api/_proxy-status to see connection status.
 */
export async function GET() {
  return proxyStatusGet();
}
