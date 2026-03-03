import { applicationsMeGet } from '@/lib/api-handlers';

export const dynamic = 'force-dynamic';

export async function GET() {
  return applicationsMeGet();
}
