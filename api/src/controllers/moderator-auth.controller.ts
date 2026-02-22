import { ModeratorAuthService } from '@/services/moderator-auth.service';

import { ValidationError, UnauthorizedError } from '../utils/errors';

export class ModeratorAuthController {
  constructor(private readonly moderatorAuthService: ModeratorAuthService) {}

  async sendOtp(body: { email: string }) {
    if (!body.email || !body.email.includes('@')) {
      throw new ValidationError('Valid email is required');
    }

    await this.moderatorAuthService.sendOtp(body.email);
    return { message: 'OTP sent successfully' };
  }

  async verifyOtp(body: { email: string; code: string }) {
    if (!body.email || !body.email.includes('@')) {
      throw new ValidationError('Valid email is required');
    }

    if (!body.code || body.code.length !== 6) {
      throw new ValidationError('Valid 6-digit OTP code is required');
    }

    const result = await this.moderatorAuthService.verifyOtpAndLoginAsModerator(
      body.email,
      body.code
    );
    return {
      token: result.token,
      moderator: result.moderator,
      X_Auth_ID: result.X_Auth_Id,
    };
  }

  async logout(token: string | undefined) {
    if (token) {
      await this.moderatorAuthService.logout(token);
    }
    return { message: 'Logged out successfully' };
  }

  async getCurrentModerator(token: string | undefined) {
    if (!token) {
      throw new UnauthorizedError('No session found');
    }

    const moderator = await this.moderatorAuthService.getCurrentModerator(token);
    if (!moderator) {
      throw new UnauthorizedError('Invalid or expired session');
    }

    return moderator;
  }
}
