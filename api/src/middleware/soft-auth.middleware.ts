import { Elysia } from 'elysia';
import { cookie } from '@elysiajs/cookie';
import { container } from '../container';

const sessionService = container.getServices().session;

export const softAuthMiddleware = new Elysia({ name: 'soft-auth' })
  .use(cookie())
  .derive({ as: 'scoped' }, async ({ cookie: { sessionToken } }) => {
    const token = typeof sessionToken?.value === 'string' ? sessionToken.value : undefined;
    if (!token) {
      return { user: null as any, userId: null as string | null };
    }
    const session = await sessionService.validateSession(token);
    if (!session) {
      return { user: null as any, userId: null as string | null };
    }
    return {
      user: session.user,
      userId: session.userId,
    };
  });
