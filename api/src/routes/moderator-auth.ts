import { Elysia, t } from 'elysia';
import { cookie } from '@elysiajs/cookie';
import { container } from '../container';
import {
  moderatorMiddleware,
  verifyXAuthHeaderMiddleware,
} from '@/middleware/moderator.middleware';

const moderatorAuthController = container.getControllers().moderatorAuth;

export const moderatorAuthRouter = new Elysia({
  prefix: '/moderator-auth',
  tags: ['moderator-auth'],
})
  .use(cookie())
  .post(
    '/otp/send',
    async ({ body }) => {
      const result = await moderatorAuthController.sendOtp(body);
      return result;
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
      }),
    }
  )
  .post(
    '/otp/verify',
    async ({ body, cookie }) => {
      const result = await moderatorAuthController.verifyOtp(body);

      // Use reactive cookie system - assign value directly
      const sessionToken = cookie.sessionToken;
      sessionToken.value = result.token;
      sessionToken.httpOnly = true;
      sessionToken.secure = process.env.NODE_ENV === 'production';
      sessionToken.sameSite = 'lax';
      sessionToken.maxAge = 30 * 24 * 60 * 60; // 30 days
      sessionToken.path = '/';

      return {
        token: result.token,
        moderator: result.moderator,
        X_Auth_ID: result.X_Auth_ID,
      };
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
        code: t.String({ minLength: 6, maxLength: 6 }),
      }),
    }
  )
  .use(verifyXAuthHeaderMiddleware)
  .use(moderatorMiddleware)
  .post(
    '/logout',
    async ({ cookie }) => {
      const sessionToken = cookie.sessionToken;
      const token = typeof sessionToken?.value === 'string' ? sessionToken.value : undefined;

      if (token) {
        await moderatorAuthController.logout(token);
      }

      // Clear cookie by removing it
      if (sessionToken) {
        sessionToken.remove();
      }

      return { message: 'Logged out successfully' };
    },
    {
      headers: t.Object({
        'x-auth-id': t.String(),
      }),
    }
  )
  .get(
    '/me',
    async ({ cookie }) => {
      const sessionToken = cookie.sessionToken;
      const token = typeof sessionToken?.value === 'string' ? sessionToken.value : undefined;
      return await moderatorAuthController.getCurrentModerator(token);
    },
    {
      headers: t.Object({
        'x-auth-id': t.String(),
      }),
    }
  );
