import { Elysia, t } from 'elysia';
import { cookie } from '@elysiajs/cookie';
import { container } from '../container';
import { verifyXAuthHeaderMiddleware } from '@/middleware/moderator.middleware';

const moderatorController = container.getControllers().moderator;

export const moderatorRouter = new Elysia({ prefix: '/moderator', tags: ['moderator'] })
  .use(verifyXAuthHeaderMiddleware)
  .post(
    '/seed',
    async ({ xAuthId, body }) => {
      const result = await moderatorController.moderatorSeed(xAuthId, body);
      return result;
    },
    {
      headers: t.Object({
        'x-auth-id': t.String(),
      }),
      body: t.Object({
        email: t.String({ format: 'email' }),
      }),
    }
  );
