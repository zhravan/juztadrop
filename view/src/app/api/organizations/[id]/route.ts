import { NextRequest } from 'next/server';
import { organizationGet, organizationPatch } from '@/lib/api-handlers';

export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return organizationGet(id);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  return organizationPatch(id, body);
}
