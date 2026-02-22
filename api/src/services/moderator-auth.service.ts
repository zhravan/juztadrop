import type { AuthUser } from '../types/auth.js';
import { OtpService } from './otp.service.js';
import { EmailService } from './email.service.js';
import { UserRepository } from '../repositories/user.repository.js';
import { logger } from '../utils/logger.js';
import {
  ValidationError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from '../utils/errors.js';
import { Moderator, ModeratorRepository } from '@/repositories/moderator.repository.js';
import { AuthService } from './auth.service.js';
import { ModeratorSessionService } from './moderatorSession.service.js';

export class ModeratorAuthService {
  constructor(
    private readonly otpService: OtpService,
    private readonly moderatorSessionService: ModeratorSessionService,
    private readonly userRepository: UserRepository,
    private readonly moderatorRepository: ModeratorRepository,
    private readonly authService: AuthService
  ) {}

  async verifyModeratorByEmail(email: string): Promise<Moderator> {
    let user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundError('user not found ');
    } else if (!user.emailVerified) {
      throw new UnauthorizedError(' unverified email');
    }

    if (user.isBanned || user.deletedAt) {
      throw new ForbiddenError('Account is banned or deleted');
    }

    const moderator = await this.moderatorRepository.findByUserId(user.id);

    if (!moderator) {
      throw new UnauthorizedError('uknown moderator');
    }
    return moderator;
  }
  async sendOtp(email: string): Promise<void> {
    await this.verifyModeratorByEmail(email);
    await this.authService.sendOtp(email);
  }

  async verifyOtpAndLoginAsModerator(
    email: string,
    code: string
  ): Promise<{ token: string; moderator: Moderator; X_Auth_Id: string }> {
    const normalizedEmail = email.toLowerCase().trim();

    const isValid = await this.otpService.verifyOtp(normalizedEmail, code);
    if (!isValid) {
      throw new ValidationError('Invalid or expired OTP code');
    }

    const moderator = await this.verifyModeratorByEmail(normalizedEmail);

    const token = await this.moderatorSessionService.createSession(moderator.id);

    const X_Auth_Id = process.env.X_AUTH_ID!;

    return { token, moderator, X_Auth_Id };
  }

  async logout(token: string): Promise<void> {
    await this.moderatorSessionService.deleteSession(token);
  }

  async getCurrentModerator(token: string): Promise<Moderator | null> {
    const session = await this.moderatorSessionService.validateSession(token);
    if (!session) {
      return null;
    }
    return session.moderator;
  }
}
