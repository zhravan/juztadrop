import { NextRequest } from 'next/server';
import { opportunityGet, opportunityPatch, opportunityDelete } from '@/lib/api-handlers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  return opportunityGet(request, context.params);
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  return opportunityPatch(request, context.params);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  return opportunityDelete(request, context.params);
}
