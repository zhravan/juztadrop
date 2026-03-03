import { causesGet, causePost } from '@/lib/api-handlers';

export const dynamic = 'force-dynamic';

export async function GET() {
  return causesGet();
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { value, label, sortOrder } = body as {
    value?: string;
    label?: string;
    sortOrder?: number;
  };
  if (typeof value !== 'string' || typeof label !== 'string') {
    return Response.json({ error: 'value and label are required' }, { status: 400 });
  }
  return causePost({ value, label, sortOrder });
}
