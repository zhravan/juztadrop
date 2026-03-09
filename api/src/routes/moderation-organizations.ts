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

const action = {
  verified: 'verified',
  rejected: 'rejected',
  suspended: 'suspended',
} as const;

export const organizationsModerationRouter = new Elysia({
  prefix: '/moderation/ngos',
  tags: ['moderation-ngos'],
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
      return pendingOrgs;
    },
    {
      headers: t.Object({
        'x-auth-id': t.String(),
      }),
      query: t.Object({ page: t.Number(), limit: t.Number() }),
    }
  )
  .patch(
    '/:organizationId/action',
    async (ctx) => {
      const { organizationId, action } = ctx.body;
      const org = await organizationRepository.UpdateVerificationStatus(organizationId, action);
      return org;
    },
    {
      headers: t.Object({
        'x-auth-id': t.String(),
      }),
      params: t.Object({ organizationId: t.String() }),
      body: t.Object({
        organizationId: t.String(),
        action: t.Enum(action),
      }),
    }
  );
