import { createId } from '@paralleldrive/cuid2';
import { ModeratorRepository, Moderator } from '../repositories/moderator.repository.js';
import { logger } from '../utils/logger.js';
import { ModeratorSessionRepository } from '@/repositories/moderatorSession.repository.js';

const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export class ModeratorSessionService {
  constructor(
    private readonly moderatorSessionRepository: ModeratorSessionRepository,
    private readonly moderatorRepository: ModeratorRepository
  ) {}

  async createSession(moderatorId: string): Promise<string> {
    const token = createId();
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

    await this.moderatorSessionRepository.create(moderatorId, token, expiresAt);
    logger.info({ moderatorId }, 'Session created');
    return token;
  }

  async validateSession(
    token: string
  ): Promise<{ moderatorId: string; moderator: Moderator } | null> {
    const moderatorSession = await this.moderatorSessionRepository.findByToken(token);

    if (!moderatorSession) {
      return null;
    }

    const moderator = await this.moderatorRepository.findById(moderatorSession.moderatorId);

    if (!moderator) {
      await this.deleteSession(token);
      return null;
    }

    if (!moderator.isActive || moderator.user.isBanned || moderator.user.deletedAt) {
      await this.deleteSession(token);
      return null;
    }

    await this.moderatorSessionRepository.updateLastAccessed(moderatorSession.id);

    return {
      moderatorId: moderatorSession.moderatorId,
      moderator,
    };
  }

  async deleteSession(token: string): Promise<void> {
    await this.moderatorSessionRepository.deleteByToken(token);
    logger.info({ token }, 'Session deleted');
  }

  async deleteModeratorSessions(moderatorId: string): Promise<void> {
    await this.moderatorSessionRepository.deleteByModeratorId(moderatorId);
    logger.info({ moderatorId }, 'All moderator sessions deleted');
  }
}
