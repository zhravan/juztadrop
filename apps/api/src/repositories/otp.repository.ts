import { db, otpTokens } from '@justadrop/db';
import { eq, and, gt } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

export interface OtpToken {
  id: string;
  email: string;
  code: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

export class OtpRepository {
  async create(email: string, code: string, expiresAt: Date): Promise<OtpToken> {
    const id = createId();
    await db.insert(otpTokens).values({
      id,
      email,
      code,
      expiresAt,
      used: false,
    });

    const token = await db.query.otpTokens.findFirst({
      where: eq(otpTokens.id, id),
    });

    if (!token) {
      throw new Error('Failed to create OTP token');
    }

    return {
      id: token.id,
      email: token.email,
      code: token.code,
      expiresAt: token.expiresAt,
      used: token.used,
      createdAt: token.createdAt,
    };
  }

  async findValidToken(email: string, code: string): Promise<OtpToken | null> {
    const token = await db.query.otpTokens.findFirst({
      where: and(
        eq(otpTokens.email, email),
        eq(otpTokens.code, code),
        eq(otpTokens.used, false),
        gt(otpTokens.expiresAt, new Date())
      ),
    });

    if (!token) {
      return null;
    }

    return {
      id: token.id,
      email: token.email,
      code: token.code,
      expiresAt: token.expiresAt,
      used: token.used,
      createdAt: token.createdAt,
    };
  }

  async markAsUsed(id: string): Promise<void> {
    await db
      .update(otpTokens)
      .set({ used: true })
      .where(eq(otpTokens.id, id));
  }
}
