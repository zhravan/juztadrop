import { Elysia } from 'elysia';
import { cookie } from '@elysiajs/cookie';
import { UnauthorizedError } from '../utils/errors';
import { container } from '../container';

const sessionService = container.getServices().session;

export const moderatorMiddleware = new Elysia({ name: 'moderator' })
  .use(cookie())
  .derive(async ({ cookie: { sessionToken } }) => {
    const token = sessionToken?.value as string | undefined;
    if (!token) {
      throw new UnauthorizedError('Authentication required');
    }

    const session = await sessionService.validateModeratorSession(token);
    if (!session) {
      throw new UnauthorizedError('Invalid or expired session');
    }

    return {
      moderator: session.moderator,
      userId: session.userId,
      moderatorId: session.moderator.id,
    };
  });

export const verifyXAuthHeaderMiddleware = new Elysia({ name: 'verify-x-auth-id' }).derive(
  { as: 'global' },
  async ({ headers }) => {
    const xAuthId = headers['x-auth-id'] || headers['X-AUTH-ID'];
    const expected = process.env.X_AUTH_ID;

    if (!xAuthId) {
      // Ensure UnauthorizedError is defined or use: throw new Error('Unauthorized')
      throw new UnauthorizedError('x-auth-id header required');
    }

    if (!expected || xAuthId !== expected) {
      throw new UnauthorizedError('Invalid x-auth-id');
    }

    return {
      xAuthId, // This will now be available in the context
    };
  }
);
