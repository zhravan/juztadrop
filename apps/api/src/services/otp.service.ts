import { EmailService } from './email.service';
import { OtpRepository } from '../repositories/otp.repository';
import { logger } from '../utils/logger';

const emailService = new EmailService();
const otpRepository = new OtpRepository();

export class OtpService {
  private generateOtpCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async generateAndSendOtp(email: string): Promise<string> {
    const code = this.generateOtpCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await otpRepository.create(email, code, expiresAt);
    await emailService.sendOtpEmail(email, code);

    logger.info({ email }, 'OTP generated and sent');
    return code;
  }

  async verifyOtp(email: string, code: string): Promise<boolean> {
    const token = await otpRepository.findValidToken(email, code);

    if (!token) {
      return false;
    }

    await otpRepository.markAsUsed(token.id);
    logger.info({ email }, 'OTP verified successfully');
    return true;
  }
}
