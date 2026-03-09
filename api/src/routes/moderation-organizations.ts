import { Elysia, t } from 'elysia';
import { cookie } from '@elysiajs/cookie';
import { container } from '../container';
import { CAUSE_VALUES } from '../constants/causes.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';
import {
  moderatorMiddleware,
  verifyXAuthHeaderMiddleware,
} from '@/middleware/moderator.middleware';

const organizationRepository = container.getRepositories().organization;

export const organizationsModerationRouter = new Elysia({
  prefix: '/moderation/moderation',
  tags: ['/moderation/moderation'],
})
  .use(cookie())
  .use(verifyXAuthHeaderMiddleware)
  .use(moderatorMiddleware)
  .get(
    '/pending',
    async (ctx: any) => {
      const { page, limit } = ctx.query;
      const pendingOrgs = await organizationRepository.findByVerificationStatus(
        'pending',
        page,
        limit
      );
      return { pendingOrgs };
    },
    {
      headers: t.Object({
        'x-auth-id': t.String(),
      }),
      query: t.Object({ page: t.Number(), limit: t.Number() }),
    }
  );
