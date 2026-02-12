import { db, sessions } from '@justadrop/db';
import { eq, and, gt } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  lastAccessedAt: Date;
}

export class SessionRepository {
  async create(userId: string, token: string, expiresAt: Date): Promise<Session> {
    const id = createId();
    await db.insert(sessions).values({
      id,
      userId,
      token,
      expiresAt,
      lastAccessedAt: new Date(),
    });

    const session = await db.query.sessions.findFirst({
      where: eq(sessions.id, id),
    });

    if (!session) {
      throw new Error('Failed to create session');
    }

    return {
      id: session.id,
      userId: session.userId,
      token: session.token,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt,
      lastAccessedAt: session.lastAccessedAt,
    };
  }

  async findByToken(token: string): Promise<Session | null> {
    const session = await db.query.sessions.findFirst({
      where: and(
        eq(sessions.token, token),
        gt(sessions.expiresAt, new Date())
      ),
    });

    if (!session) {
      return null;
    }

    return {
      id: session.id,
      userId: session.userId,
      token: session.token,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt,
      lastAccessedAt: session.lastAccessedAt,
    };
  }

  async updateLastAccessed(id: string): Promise<void> {
    await db
      .update(sessions)
      .set({ lastAccessedAt: new Date() })
      .where(eq(sessions.id, id));
  }

  async deleteByToken(token: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.token, token));
  }

  async deleteByUserId(userId: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.userId, userId));
  }
}
