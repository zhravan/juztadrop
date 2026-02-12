import { OtpService } from './otp.service';
import { SessionService } from './session.service';
import { EmailService } from './email.service';
import { UserRepository } from '../repositories/user.repository';
import { logger } from '../utils/logger';

const otpService = new OtpService();
const sessionService = new SessionService();
const emailService = new EmailService();
const userRepository = new UserRepository();

export class AuthService {
  async sendOtp(email: string): Promise<void> {
    const normalizedEmail = email.toLowerCase().trim();
    await otpService.generateAndSendOtp(normalizedEmail);
  }

  async verifyOtpAndLogin(email: string, code: string): Promise<{ token: string; user: any }> {
    const normalizedEmail = email.toLowerCase().trim();

    const isValid = await otpService.verifyOtp(normalizedEmail, code);
    if (!isValid) {
      throw new Error('Invalid or expired OTP code');
    }

    let user = await userRepository.findByEmail(normalizedEmail);

    if (!user) {
      user = await userRepository.create(normalizedEmail, true);
      await emailService.sendWelcomeEmail(normalizedEmail);
      logger.info({ email: normalizedEmail }, 'New user created');
    } else if (!user.emailVerified) {
      await userRepository.updateEmailVerified(user.id, true);
      user = await userRepository.findById(user.id);
      if (!user) {
        throw new Error('Failed to update user');
      }
    }

    if (user.isBanned || user.deletedAt) {
      throw new Error('Account is banned or deleted');
    }

    const token = await sessionService.createSession(user.id);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
      },
    };
  }

  async logout(token: string): Promise<void> {
    await sessionService.deleteSession(token);
  }

  async getCurrentUser(token: string): Promise<any> {
    const session = await sessionService.validateSession(token);
    if (!session) {
      return null;
    }
    return session.user;
  }
}
