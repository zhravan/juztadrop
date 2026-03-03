import { authLogout } from '@/lib/api-handlers';

export const dynamic = 'force-dynamic';

export async function POST() {
  return authLogout();
}
