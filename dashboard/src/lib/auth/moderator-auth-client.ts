const API_BASE = '/api/moderator-auth';

export type VolunteeringData = {
  isInterest: boolean;
  skills: Array<{ name: string; expertise: string }>;
  causes: string[];
};

export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string | null;
  phone: string | null;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null;
  isBanned: boolean;
  volunteering: VolunteeringData | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Moderator {
  id: string;
  userId: string;
  isActive: boolean;
  assignedRegions: string[] | null;
  createdAt: Date;
  updatedAt: Date;

  user: User;
}

export interface SendOtpResponse {
  success?: boolean;
  error?: string;
}

export interface VerifyOtpResponse {
  moderator: Moderator;
}

export const moderatorAuthClient = {
  async sendOtp(email: string): Promise<SendOtpResponse> {
    const res = await fetch(`${API_BASE}/otp/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.toLowerCase().trim() }),
      credentials: 'include',
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || data.error || 'Failed to send code');
    }
    return data;
  },

  async verifyOtp(email: string, code: string): Promise<VerifyOtpResponse> {
    const res = await fetch(`${API_BASE}/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        code: code.trim(),
      }),
      credentials: 'include',
    });
    const data = await res.json().catch(() => ({}));

    const resXAuthId = res.headers.get('x-auth-id');
    sessionStorage.setItem('x-auth-id', resXAuthId || '');

    if (!res.ok) {
      throw new Error(data.message || data.error || 'Invalid or expired code');
    }
    return data;
  },

  async getSession(): Promise<Moderator | null> {
    const XAuthId = sessionStorage.getItem('x-auth-id');

    const res = await fetch(`${API_BASE}/me`, {
      headers: {
        'x-auth-id': XAuthId || '',
      },
      credentials: 'include',
    });
    if (res.status === 401) return null;
    const data = await res.json().catch(() => null);
    if (!res.ok) return null;
    return data;
  },

  async logout(): Promise<void> {
    await fetch(`${API_BASE}/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  },
};
