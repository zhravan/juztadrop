import { ModeratorService } from '@/services/moderator.service';

import { ValidationError } from '../utils/errors';

export class ModeratorController {
  constructor(private readonly moderator: ModeratorService) {}

  async moderatorSeed(XAuthId: string, body: { email: string }) {
    if (!body.email || !body.email.includes('@')) {
      throw new ValidationError('Valid email is required');
    }

    if (!XAuthId) {
      throw new ValidationError('Invalid XAuthId is required');
    }

    return await this.moderator.seedModerator(XAuthId, body.email);
  }
}
