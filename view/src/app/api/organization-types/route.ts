import { organizationTypesGet } from '@/lib/api-handlers';

export const dynamic = 'force-dynamic';

export async function GET() {
  return organizationTypesGet();
}
