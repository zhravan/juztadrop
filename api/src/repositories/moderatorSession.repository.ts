import { db, moderatorSessions } from '../db/index.js';
import { eq, and, gt } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

export interface ModeratorSession {
  id: string;
  moderatorId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  lastAccessedAt: Date;
}

export class ModeratorSessionRepository {
  async create(moderatorId: string, token: string, expiresAt: Date): Promise<ModeratorSession> {
    const id = createId();
    await db.insert(moderatorSessions).values({
      id,
      moderatorId,
      token,
      expiresAt,
      lastAccessedAt: new Date(),
    });

    const session = await db.query.moderatorSessions.findFirst({
      where: eq(moderatorSessions.id, id),
    });

    if (!session) {
      throw new Error('Failed to create session');
    }

    return {
      id: session.id,
      moderatorId: session.moderatorId,
      token: session.token,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt,
      lastAccessedAt: session.lastAccessedAt,
    };
  }

  async findByToken(token: string): Promise<ModeratorSession | null> {
    const session = await db.query.moderatorSessions.findFirst({
      where: and(eq(moderatorSessions.token, token), gt(moderatorSessions.expiresAt, new Date())),
    });

    if (!session) {
      return null;
    }

    return {
      id: session.id,
      moderatorId: session.moderatorId,
      token: session.token,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt,
      lastAccessedAt: session.lastAccessedAt,
    };
  }

  async updateLastAccessed(id: string): Promise<void> {
    await db
      .update(moderatorSessions)
      .set({ lastAccessedAt: new Date() })
      .where(eq(moderatorSessions.id, id));
  }

  async deleteByToken(token: string): Promise<void> {
    await db.delete(moderatorSessions).where(eq(moderatorSessions.token, token));
  }

  async deleteByModeratorId(moderatorId: string): Promise<void> {
    await db.delete(moderatorSessions).where(eq(moderatorSessions.moderatorId, moderatorId));
  }
}
