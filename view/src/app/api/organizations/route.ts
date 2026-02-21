import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('sessionToken')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const res = await fetch(`${API_URL}/organizations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `sessionToken=${token}`,
      },
      body: JSON.stringify(body),
    });

    const text = await res.text();
    let json: any = {};
    try {
      json = JSON.parse(text);
    } catch {
      console.error('Failed to parse response as JSON:', text);
    }

    if (!res.ok) {
      console.error('Backend error response:', {
        status: res.status,
        statusText: res.statusText,
        json,
        text,
        body,
      });
      // Backend returns { success: false, error: { message, code, details } }
      const errorMessage = json?.error?.message || json?.message || 'Failed to create organization';
      return NextResponse.json({ error: errorMessage }, { status: res.status });
    }

    // Backend returns { success: true, data: { organization: {...} } }
    const responseData = json?.data ?? json;
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Organizations POST error:', error);
    return NextResponse.json({ error: 'Failed to create organization' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('sessionToken')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const res = await fetch(`${API_URL}/organizations/me`, {
      method: 'GET',
      headers: {
        Cookie: `sessionToken=${token}`,
      },
      cache: 'no-store',
    });

    const text = await res.text();
    let json: any = {};
    try {
      json = JSON.parse(text);
    } catch {
      console.error('Failed to parse response as JSON:', text);
    }

    if (!res.ok) {
      console.error('Backend error response:', {
        status: res.status,
        statusText: res.statusText,
        json,
        text,
      });
      // Backend returns { success: false, error: { message, code, details } }
      const errorMessage = json?.error?.message || json?.message || 'Failed to fetch organizations';
      return NextResponse.json({ error: errorMessage }, { status: res.status });
    }

    // Backend returns { success: true, data: { organizations: [...] } }
    const responseData = json?.data ?? json;
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Organizations GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch organizations' }, { status: 500 });
  }
}
