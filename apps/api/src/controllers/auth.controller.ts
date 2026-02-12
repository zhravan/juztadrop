import { AuthService } from '../services/auth.service';
import { ValidationError, UnauthorizedError } from '../utils/errors';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async sendOtp(body: { email: string }) {
    if (!body.email || !body.email.includes('@')) {
      throw new ValidationError('Valid email is required');
    }

    await this.authService.sendOtp(body.email);
    return { message: 'OTP sent successfully' };
  }

  async verifyOtp(body: { email: string; code: string }) {
    if (!body.email || !body.email.includes('@')) {
      throw new ValidationError('Valid email is required');
    }

    if (!body.code || body.code.length !== 6) {
      throw new ValidationError('Valid 6-digit OTP code is required');
    }

    const result = await this.authService.verifyOtpAndLogin(body.email, body.code);
    return {
      token: result.token,
      user: result.user,
      isNewUser: result.isNewUser,
    };
  }

  async logout(token: string | undefined) {
    if (token) {
      await this.authService.logout(token);
    }
    return { message: 'Logged out successfully' };
  }

  async getCurrentUser(token: string | undefined) {
    if (!token) {
      throw new UnauthorizedError('No session found');
    }

    const user = await this.authService.getCurrentUser(token);
    if (!user) {
      throw new UnauthorizedError('Invalid or expired session');
    }

    return { user };
  }
}
