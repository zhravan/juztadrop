import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function PATCH(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('sessionToken')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const res = await fetch(`${API_URL}/users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `sessionToken=${token}`,
      },
      credentials: 'include',
      body: JSON.stringify(body),
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      // Backend returns { success: false, error: { message, code, details } }
      const errorMessage = json?.error?.message || json?.message || 'Failed to update';
      return NextResponse.json({ error: errorMessage }, { status: res.status });
    }

    // Backend returns { success: true, data: { user } } via response envelope
    const responseData = json?.data ?? json;
    if (responseData?.user === null) {
      return NextResponse.json({ error: 'User not found after update' }, { status: 500 });
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Users me PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
